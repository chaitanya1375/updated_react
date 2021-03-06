import React from "react";
import _ from "underscore";
import moment from "moment";
import merge from "merge";

// Pond
import { TimeSeries } from "pondjs";
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
    Resizable,
    Legend,
    styler
} from "react-timeseries-charts";


const ddosData = require("./data.json");

const requests = [];
const connections = [];

_.each(ddosData, val => {
    const timestamp = moment(new Date(`2015-04-03 ${val["time PST"]}`));
    const numConnection = val["connections"];
    const httpRequests = val["http requests"];
    requests.push([timestamp.toDate().getTime(), httpRequests]);
    connections.push([timestamp.toDate().getTime(), numConnection]);
});

const connectionsSeries = new TimeSeries({
    name: "connections",
    columns: ["time", "connections"],
    points: connections
});

const requestsSeries = new TimeSeries({
    name: "requests",
    columns: ["time", "requests"],
    points: requests
});

//
// Styles
//

const style = styler([
    { key: "connections", color: "#2ca02c", width: 1 },
    { key: "requests", color: "#9467bd", width: 2 }
]);

const ddos = React.createClass({
    getInitialState() {
        return {
            active: {
                requests: true,
                connections: true
            }
        };
    },
    renderChart() {
        let charts = [];
        let max = 100;
        if (this.state.active.requests) {
            const maxRequests = requestsSeries.max("requests");
            if (maxRequests > max) max = maxRequests;
            charts.push(
                <LineChart
                    key="requests"
                    axis="axis1"
                    series={requestsSeries}
                    columns={["requests"]}
                    style={style}
                    interpolation="curveBasis"
                />
            );
        }
        if (this.state.active.connections) {
            const maxConnections = connectionsSeries.max("connections");
            if (maxConnections > max) max = maxConnections;
            charts.push(
                <LineChart
                    key="connections"
                    axis="axis2"
                    series={connectionsSeries}
                    columns={["connections"]}
                    style={style}
                    interpolation="curveBasis"
                />
            );
        }

        const axisStyle = {
            labels: {
                labelColor: "grey", // Default label color
                labelWeight: 100,
                labelSize: 11
            },
            axis: {
                axisColor: "grey",
                axisWidth: 1
            }
        };

        const requestsAxisStyle = merge(true, axisStyle, style.axisStyle("requests"));
        const connectionsAxisStyle = merge(true, axisStyle, style.axisStyle("connections"));

        return (
            <ChartContainer timeRange={requestsSeries.range()} timeAxisStyle={axisStyle}>
                <ChartRow height="300">
                    <YAxis
                        id="axis1"
                        label="Requests"
                        transition={300}
                        style={requestsAxisStyle}
                        labelOffset={-10}
                        min={0}
                        max={max}
                        format=",.0f"
                        width="60"
                        type="linear"
                    />
                    <Charts>
                        {charts}
                    </Charts>
                    <YAxis
                        id="axis2"
                        label="Connections"
                        transition={300}
                        style={connectionsAxisStyle}
                        labelOffset={12}
                        min={0}
                        format=",.0f"
                        max={max}
                        width="80"
                        type="linear"
                    />
                </ChartRow>
            </ChartContainer>
        );
    },
    handleActiveChange(key) {
        const active = this.state.active;
        active[key] = !active[key];
        this.setState({ active });
    },
    render() {
        const legend = [
            {
                key: "requests",
                label: "Requests",
                disabled: !this.state.active.requests
            },
            {
                key: "connections",
                label: "Connections",
                disabled: !this.state.active.connections
            }
        ];

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Legend
                            type="line"
                            style={style}
                            categories={legend}
                            onSelectionChange={this.handleActiveChange}
                        />
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            {this.renderChart()}
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
});

export default ddos;