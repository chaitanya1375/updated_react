import React from 'react';
import { connect } from 'react-redux';
import '../../assets/styles/currency-chart.css';

class CurrencyStatistic extends React.Component {

    handleChange(e){
        this.props.first(e.target.value);
    }

    render(){
        let dynamicClass = this.props.selectedCurrency.id;
        return (
            <div className="card">
                <select className='select' value={this.props.selectedCurrency.id}
                        onChange={this.handleChange.bind(this)}>
                    <option value="Bitcoin">Bitcoin</option>
                    <option value="Ethereum">Ethereum</option>
                    <option value="Ripple">Ripple</option>
                </select>
                <div className={`imageContainer ${dynamicClass}`} />
            </div>
        );
    }
}
const mapStateToProps = function(state){
    return {
        selectedCurrency:state.selectedCurrency
    };
};

const mapDispatchToProps = function(dispatch){
    return{
        first: function(id){ return dispatch({type: "CHANGE_CURRENCY", id:id})}
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyStatistic)