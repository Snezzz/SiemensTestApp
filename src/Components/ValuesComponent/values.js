import React, { Component }  from 'react';
import './values.css'
import hash from 'js-hash-code'
import {get_cookie} from '../cookieHelper'

class ValuesComponent extends Component{
    constructor(props){
        super(props);
        this.state= {
            values: get_cookie("data") || [] //get data from cookie or create new object
        };
        this.addNewPoint = this.addNewPoint.bind(this);
        this.remove = this.remove.bind(this);
    }

    /**
     ** Method to add new point to the list of points and than to the graph by 'Enter'
     * @param e
     * @returns {boolean}
     */
    addNewPoint(e){
        const target = e.target;
        if(e.key==="Enter"){
            if(!target.value)
                return false;
            const value = Number(target.value);
            const date = new Date();
            const dateValue = date.getMinutes()+":"+date.getSeconds()+":"+date.getMilliseconds();
            const obj = {"value":value, "date":dateValue,"x":this.state.values.length};
            this.state.values.push(obj);
            this.setState({values:this.state.values}); //update list of points
            this.props.update({"value":value,"x":this.state.values.length,"date":obj.date},'add'); //update the graph
            target.value = "";
        }

    }

    /**
     ** Method to remove the point from the list of points and to update the graph
     * @param i - index of the point we have to delete
     */
    remove(i){
        const len = this.state.values.length;
        const first = this.state.values.slice(0,i);
        const second = this.state.values.slice(i+1,len);
        this.setState({values:first.concat(second)});
        this.props.update(i,'remove'); //update the graph
    }

    render(){
        return(
            <div className="values-list-box">
                <div><b>Data</b></div>
                <input type="number" step="1" onKeyPress={this.addNewPoint}/>
                <div className="list-title">List of values:</div>
                <ul className="values-list">
                    {this.state.values.map((obj,i) =>
                        <li key={hash(obj)}>
                            <div className="value">
                                <span>{obj.date}</span>
                                <b>{obj.value}</b>
                                <button onClick={this.remove.bind(this, i)}>Remove</button>
                            </div>
                            </li>)
                    }
                </ul>
            </div>
        )

    }
}

export default ValuesComponent;