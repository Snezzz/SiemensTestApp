import {Component} from "react";
import React from "react";
import './main.css'
import {select} from "d3-selection";
import {scaleLinear} from "d3-scale";
import {line} from "d3-shape";
import {get_cookie} from '../cookieHelper'
import {max} from "d3-array"
import ValuesComponent from "../ValuesComponent/index";

class MainComponent extends Component{

    constructor(){
        super();
        this.state = {
            data: get_cookie("data")||[]
        };
        this.update = this.update.bind(this);
        this.createGraph = this.createGraph.bind(this);
        this.movePanel = this.movePanel.bind(this);
    }

    /**
     * Method to update the graph
     * @param data - new point
     * @param type - define what we want to do: add or remove point
     * @returns {Promise<void>}
     */
    async update(data,type){
        switch (type){
            case 'add':
                this.state.data.push(data);
                this.setState({
                    data: this.state.data
                });
                break;
            case 'remove':
                const firstPart = this.state.data.slice(0,data);
                const secondPart = this.state.data.slice(data+1,this.state.data.length);
                await this.setState({
                    data: firstPart.concat(secondPart)
                });
                break;
        }
        document.getElementsByClassName("graph")[0].innerHTML=""; //clear old graph
        this.createGraph(); //update graph after data updating
        document.cookie="data="+JSON.stringify(this.state.data); //update cookie
    }

    /**
     * Method to create new graph using d3.js
     */
    createGraph() {
        const margin = {top: 50, right: 50, bottom: 50, left: 50}
            ,width = window.innerWidth - 600 - margin.left - margin.right
            , height = window.innerHeight - margin.top - margin.bottom;
        const xScale = scaleLinear()
            .domain([0, 100])
            .range([0, 3000]);
        const yScale = scaleLinear()
            .domain([-20, max(this.state.data, function(d) { return +d.value; })])
            .range([height, 0]); // output
        const lineX = line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d.value); });
        const svg = select(".graph").append("svg")
            .attr('width', width*10)
            .attr('height', height*10)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");
//            .call(axisBottom(xScale));
        svg.append("g")
            .attr("class", "y axis");
  //          .call(axisLeft(yScale));
        svg.append("path")
           .datum(this.state.data)
            .attr("class", "line")
            .attr("d", lineX);
        svg.selectAll(".dot")
            .data(this.state.data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d, i) { return xScale(i) })
            .attr("cy", function(d) { return yScale(d.value) })
            .text("I'm a label")
            .attr("r", 3);
        const text = svg.selectAll("text")
                            .data(this.state.data)
                                .enter()
                                .append("text");
        const textLabels = text
            .attr("x", function(d,i) { return xScale(i); })
            .attr("y",function(d) { return yScale(d.value)-3 })
            .text( function (d) { return d.value})
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black");
    }

    /**
     * Method to move left and right panels clicking the cursor
     * @param e
     */
    movePanel(e){
        const target = e.target;
        target.style.animationName="";
        target.style.animationDuration="";
        target.parentElement.style.animationName="";
        target.parentElement.style.animationDuration="";

        //define in what direction we have to move panel
        if(e.target.parentElement.classList.contains("panel--closed")){
            target.parentElement.style.animationName="slideInLeft";
            target.parentElement.style.animationDuration="1s";
            target.style.animationName =  'rotateOut';
            target.style.animationDuration = '1s';
            target.parentElement.setAttribute("class","panel");
        }
        else{
            target.style.animationName =  'rotateIn';
            target.style.animationDuration = '1s';
            target.parentElement.setAttribute("class","panel--closed");
        }
        //remove old event listener to haven't more than one event listeners in future
        target.removeEventListener('click',e);
        let direction = target.getAttribute("class").split("-")[1];
        if(direction==='right'){
            target.setAttribute("class","panel-left")
        }
        else{
            target.setAttribute("class","panel-right")
        }
    }

    //create graph just when component have created (it is necessary when we update page and load data from cookie)
    componentDidMount(){
        this.createGraph();
    }

    render(){
        return(
            <div className="main">
                <div className="panel">
                    <div className="panel-left" onClick={this.movePanel.bind(this)}/>
                </div>
                <div className="content">
                    <div className="graph-illustration" >
                        <div className="graph"/>
                    </div>
                    <ValuesComponent update={this.update} data={this.state.data}/>
                </div>
                <div className="panel">
                    <div className="panel-right" onClick={this.movePanel.bind(this)}/>
                </div>
            </div>
        )
    }
}

export default MainComponent;