import React from "react";
import _ from "underscore";
import moment from "moment";
import { format } from "d3-format";

// Pond
import { TimeSeries } from "pondjs";
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    BarChart,
    Resizable,
    Legend,
    styler
} from "react-timeseries-charts";


const monthlyJSON  = require("./data.json");

const trafficPoints = [];
const interfacesJSON = require("./interface-traffic.json");
const interfaceKey = "ornl-cr5::to_ornl_ip-a::standard";
const days = interfacesJSON[interfaceKey].days;

let max = 0;
_.each(days, (value, day) => {
    const dayOfMonth = Number(day);
    const volIn = value.in;
    const volOut = value.out;

    // Max
    max = Math.max(max, value.in);
    max = Math.max(max, value.out);

    trafficPoints.push([`2014-10-${dayOfMonth}`, volIn, volOut]);
});

const octoberTrafficSeries = new TimeSeries({
    name: "October Traffic",
    utc: false,
    columns: ["index", "in", "out"],
    points: trafficPoints
});

max /= 100;

//
// October 2014 net daily traffic for multiple interfaces
//

const netTrafficPoints = [];
const interfaceKeys = [
    "lbl-mr2::xe-8_3_0.911::standard",
    "pnwg-cr5::111-10_1_4-814::sap",
    "denv-cr5::to_denv-frgp(as14041)::standard"
];
const octoberDays = interfacesJSON[interfaceKeys[0]].days;

let maxTotalTraffic = 0;
let minTotalTraffic = 0;
_.each(octoberDays, (ignoreValue, day) => {
    const dayOfMonth = Number(day);
    const netTrafficForDay = [`2014-10-${dayOfMonth}`];
    let maxDay = 0;
    let minDay = 0;
    _.each(interfaceKeys, interfaceKey => {
        let value = interfacesJSON[interfaceKey].days[dayOfMonth];
        let netTraffic = value.out - value.in;
        netTrafficForDay.push(netTraffic);
        if (netTraffic > 0) {
            maxDay += netTraffic;
        } else {
            minDay += netTraffic;
        }
    });
    maxTotalTraffic = Math.max(maxTotalTraffic, maxDay);
    minTotalTraffic = Math.min(minTotalTraffic, minDay);
    netTrafficPoints.push(netTrafficForDay);
});

const netTrafficColumnNames = ["index"];
_.each(interfaceKeys, interfaceKey => {
    netTrafficColumnNames.push(interfaceKey.split(":")[0]);
});

const octoberNetTrafficSeries = new TimeSeries({
    name: "October Net Traffic",
    utc: false,
    columns: netTrafficColumnNames,
    points: netTrafficPoints
});

// Correct for measurement error on October 10th
maxTotalTraffic /= 150;
minTotalTraffic /= 10;

//
// ESnet wide monthy traffic summary (part of 2014)
//

const routerData = {};
_.each(monthlyJSON, router => {
    const routerName = router["Router"];
    if (routerName) {
        routerData[routerName] = {
            accepted: [],
            delivered: []
        };
        _.each(router, (traffic, key) => {
            if (key !== "Router") {
                const month = key.split(" ")[0];
                const type = key.split(" ")[1];
                if (type === "Accepted") {
                    routerData[routerName].accepted.push([month, traffic]);
                } else if (type === "Delivered") {
                    routerData[routerName].delivered.push([month, traffic]);
                }
            }
        });
    }
});

const Ripple = React.createClass({
    displayName: "VolumeExample",
    getInitialState() {
        return {
            timerange: octoberTrafficSeries.range(),
            selection: null
        };
    },
    handleTimeRangeChange(timerange) {
        this.setState({ timerange });
    },
    render() {
        /*
        
        Styling the hard way

        const style = {
            in: {
                normal: {fill: "#A5C8E1"},
                highlighted: {fill: "#BFDFF6"},
                selected: {fill: "#2DB3D1"},
                muted: {fill: "#A5C8E1", opacity: 0.4}
            }
        };

        const altStyle = {
            out: {
                normal: {fill: "#FFCC9E"},
                highlighted: {fill: "#fcc593"},
                selected: {fill: "#2DB3D1"},
                muted: {fill: "#FFCC9E", opacity: 0.4}
            }
        };
       
        const combinedStyle = {
            in: {
                normal: {fill: "#A5C8E1"},
                highlighted: {fill: "#BFDFF6"},
                selected: {fill: "#2DB3D1"},
                muted: {fill: "#A5C8E1", opacity: 0.4}
            },
            out: {
                normal: {fill: "#FFCC9E"},
                highlighted: {fill: "#fcc593"},
                selected: {fill: "#2DB3D1"},
                muted: {fill: "#FFCC9E", opacity: 0.4}
            }
        };
        */

        const style = styler([
            { key: "in", color: "#A5C8E1", selected: "#2CB1CF" },
            { key: "out", color: "#FFCC9E", selected: "#2CB1CF" },
            {
                key: netTrafficColumnNames[1],
                color: "#A5C8E1",
                selected: "#2CB1CF"
            },
            {
                key: netTrafficColumnNames[2],
                color: "#FFCC9E",
                selected: "#2CB1CF"
            },
            {
                key: netTrafficColumnNames[3],
                color: "#DEB887",
                selected: "#2CB1CF"
            }
        ]);

        const formatter = format(".2s");
        const selectedDate = this.state.selection
            ? this.state.selection.event.index().toNiceString()
            : "--";
        const selectedValue = this.state.selection
            ? `${formatter(+this.state.selection.event.value(this.state.selection.column))}b`
            : "--";

        const highlight = this.state.highlight;
        let infoValues = [];
        let infoNetValues = [];
        if (highlight) {
            const trafficText = `${formatter(highlight.event.get(highlight.column))}`;
            infoValues = [{ label: "Traffic", value: trafficText }];
            infoNetValues = [{ label: "Traffic " + highlight.column, value: trafficText }];
        }

        return (
            <div>

                <div className="row">
                    <div className="col-md-12">
                        <b>October 2014 Total Traffic</b>
                        <p style={{ color: "#808080" }}>
                            Selected: {selectedDate} - {selectedValue}
                        </p>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={octoberTrafficSeries.range()}
                                format="day"
                                onBackgroundClick={() => this.setState({ selection: null })}
                            >
                                <ChartRow height="150">
                                    <YAxis
                                        id="traffic-volume"
                                        label="Traffic (B)"
                                        classed="traffic-in"
                                        min={0}
                                        max={max}
                                        width="70"
                                        type="linear"
                                    />
                                    <Charts>
                                        <BarChart
                                            axis="traffic-volume"
                                            style={style}
                                            spacing={3}
                                            columns={["in", "out"]}
                                            series={octoberTrafficSeries}
                                            info={infoValues}
                                            highlighted={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })}
                                            selected={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })}
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

                         
            </div>
        );
    }
});


export default Ripple;