import {useEffect, useRef, useState} from "react";
import randomColor from "randomcolor";
import * as d3 from "d3";


const colors =[];
let xScaleEU;
let yScaleEU;
let xScaleNA;
let yScaleNA;
let xScaleJP;
let yScaleJP;
let svgEU;
let svgNA;
let svgJP;
export default function PopulationDiagram ({displayData,type}) {

    const svgEURef = useRef();
    const svgNARef = useRef();
    const svgJPRef = useRef();
    const [displayedLines, setDisplayedLines] = useState([])
    useEffect(()=>{
        generateRandomColors();
        createNASVG()
        createJPSVG()
        createEUSVG()

    },[displayData])

    const createEUSVG = () =>{
        const margin = {top: 50, right: 50, bottom: 50, left: 50};
        const width = (window.innerWidth/2) - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        xScaleEU = d3
            .scaleLinear()
            .domain([
                d3.min(displayData["EU"], (d) => d3.min(d.values, v => +v.xValue)),
                d3.max(displayData["EU"], (d) => d3.max(d.values, v => +v.xValue))
            ])
            .range([50, width]);

        yScaleEU = d3
            .scaleLinear()
            .domain([
                d3.min(displayData["EU"], (d) => d3.min(d.values, v => +v.yValue)),
                d3.max(displayData["EU"], (d) => d3.max(d.values, v => +v.yValue))
            ])
            .range([height, 0]);

        const svgElEU = d3.select(svgEURef.current);
        svgElEU.selectAll("*").remove();

        svgEU = svgElEU
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xTicks = xScaleEU.domain()[1] - xScaleEU.domain()[0];
        const xAxis = d3
            .axisBottom(xScaleEU)
            .ticks(xTicks)
            .tickFormat(x => x.toString().slice(2,4));

        const xAxisGroup = svgEU
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        xAxisGroup.select(".domain").remove();
        xAxisGroup.selectAll("line").attr("stroke", "rgb(255, 0, 0)");
        xAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");

        const yAxis = d3
            .axisLeft(yScaleEU)
            .ticks(10)
            .tickFormat(x => Number(x));

        const yAxisGroup = svgEU.append("g").call(yAxis);
        yAxisGroup.select(".domain").remove();
        yAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");

        svgEU
            .append("rect")
            .attr("width", width+50)
            .attr("height", height)
            .attr("fill", "#03001C");
        createLineNames();

    }
    const createNASVG = () =>{
        const margin = {top: 50, right: 50, bottom: 50, left: 50};
        const width = (window.innerWidth/2) - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        xScaleNA = d3
            .scaleLinear()
            .domain([
                d3.min(displayData["NA"], (d) => d3.min(d.values, v => +v.xValue)),
                d3.max(displayData["NA"], (d) => d3.max(d.values, v => +v.xValue))
            ])
            .range([50, width]);

        yScaleNA = d3
            .scaleLinear()
            .domain([
                d3.min(displayData["NA"], (d) => d3.min(d.values, v => +v.yValue)),
                d3.max(displayData["NA"], (d) => d3.max(d.values, v => +v.yValue))
            ])
            .range([height, 0]);

        const svgElNA = d3.select(svgNARef.current);
        svgElNA.selectAll("*").remove();

        svgNA = svgElNA
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xTicks = xScaleNA.domain()[1] - xScaleNA.domain()[0];
        const xAxis = d3
            .axisBottom(xScaleNA)
            .ticks(xTicks)
            .tickFormat(x => x.toString().slice(2,4));

        const xAxisGroup = svgNA
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        xAxisGroup.select(".domain").remove();
        xAxisGroup.selectAll("line").attr("stroke", "rgb(255, 0, 0)");
        xAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");

        const yAxis = d3
            .axisLeft(yScaleNA)
            .ticks(10)
            .tickFormat(x => Number(x));

        const yAxisGroup = svgNA.append("g").call(yAxis);
        yAxisGroup.select(".domain").remove();
        yAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");

        svgNA
            .append("rect")
            .attr("width", width+50)
            .attr("height", height)
            .attr("fill", "#03001C");
    }
    const createJPSVG = () =>{
        const margin = {top: 50, right: 50, bottom: 50, left: 50};
        const width = (window.innerWidth/2) - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        xScaleJP = d3
            .scaleLinear()
            .domain([
                d3.min(displayData["JP"], (d) => d3.min(d.values, v => +v.xValue)),
                d3.max(displayData["JP"], (d) => d3.max(d.values, v => +v.xValue))
            ])
            .range([50, width]);

        yScaleJP = d3
            .scaleLinear()
            .domain([
                d3.min(displayData["JP"], (d) => d3.min(d.values, v => +v.yValue)),
                d3.max(displayData["JP"], (d) => d3.max(d.values, v => +v.yValue))
            ])
            .range([height, 0]);

        const svgElJP = d3.select(svgJPRef.current);
        svgElJP.selectAll("*").remove();

        svgJP = svgElJP
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xTicks = xScaleJP.domain()[1] - xScaleJP.domain()[0];
        const xAxis = d3
            .axisBottom(xScaleJP)
            .ticks(xTicks)
            .tickFormat(x => {
                return x.toString().slice(2, 4)
            });

        const xAxisGroup = svgJP
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        xAxisGroup.select(".domain").remove();
        xAxisGroup.selectAll("line").attr("stroke", "rgb(255, 0, 0)");
        xAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");

        const yAxis = d3
            .axisLeft(yScaleJP)
            .ticks(10)
            .tickFormat(x => Number(x));

        const yAxisGroup = svgJP.append("g").call(yAxis);
        yAxisGroup.select(".domain").remove();
        yAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");

        svgJP
            .append("rect")
            .attr("width", width+50)
            .attr("height", height)
            .attr("fill", "#03001C");
    }

    useEffect(()=>{
        createLinesNA()
        createLinesJP()
        createLinesEU()
    },[displayedLines])
    const createLineNames = () => {
        const lineNames =[]
        for(let i=0;i<displayData["EU"].length;i++){
            lineNames.push({name:displayData["EU"][i].label,list:true});
        }
        setDisplayedLines(lineNames)
    }

    const createLinesEU = () =>{
        if(!displayedLines.length){
            return;
        }
        svgEU.selectAll("path.lines").remove();
        const line = d3
            .line()
            .x((d) => xScaleEU(d.xValue))
            .y((d) => yScaleEU(d.yValue));


        const lines = svgEU
            .selectAll(".line")
            .data(displayData["EU"])
            .enter()
            .append("path")
            .attr("class","lines")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("d", (d) => line(d.values));

        lines.each((d, i, nodes) => {
            const element = nodes[i];
            const length = element.getTotalLength();
            if(displayedLines[i].list === false){
                svgEU.selectAll("g.circle-group-"+displayedLines[i].name).remove()
                element.remove();
                return;
            }

            d3.select(element)
                .attr("stroke-dasharray", `${length},${length}`)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration(750)
                .attr("stroke", colors[i])
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);


            const circles = svgEU
                .selectAll(".circle")
                .data(d.values)
                .enter()
                .append("g")
                .attr("class", "circle-group-"+displayedLines[i].name)

            circles
                .append("circle")
                .attr("cx", (d) => xScaleEU(d.xValue))
                .attr("cy", (d) => yScaleEU(d.yValue))
                .attr("r", 5)
                .attr("fill", colors[i])
                .append("title")
                .text((text) => `Genre: ${d.label} \n Year: ${text.xValue}, Amount: ${text.yValue} (/100 people)`);
        });
    }
    const createLinesNA = () =>{
        if(!displayedLines.length){
            return;
        }
        svgNA.selectAll("path.lines").remove();
        const line = d3
            .line()
            .x((d) => xScaleNA(d.xValue))
            .y((d) => yScaleNA(d.yValue));


        const lines = svgNA
            .selectAll(".line")
            .data(displayData["NA"])
            .enter()
            .append("path")
            .attr("class","lines")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("d", (d) => line(d.values));

        lines.each((d, i, nodes) => {
            const element = nodes[i];
            const length = element.getTotalLength();
            if(displayedLines[i].list === false){
                svgNA.selectAll("g.circle-group-"+displayedLines[i].name).remove()
                element.remove();
                return;
            }

            d3.select(element)
                .attr("stroke-dasharray", `${length},${length}`)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration(750)
                .attr("stroke", colors[i])
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);


            const circles = svgNA
                .selectAll(".circle")
                .data(d.values)
                .enter()
                .append("g")
                .attr("class", "circle-group-"+displayedLines[i].name)

            circles
                .append("circle")
                .attr("cx", (d) => xScaleNA(d.xValue))
                .attr("cy", (d) => yScaleNA(d.yValue))
                .attr("r", 5)
                .attr("fill", colors[i])
                .append("title")
                .text((text) => `Genre: ${d.label} \n Year: ${text.xValue}, Amount: ${text.yValue} (/100 people)`);
        });
    }
    const createLinesJP = () =>{
        if(!displayedLines.length){
            return;
        }
        svgJP.selectAll("path.lines").remove();
        const line = d3
            .line()
            .x((d) => xScaleJP(d.xValue))
            .y((d) => yScaleJP(d.yValue));


        const lines = svgJP
            .selectAll(".line")
            .data(displayData["JP"])
            .enter()
            .append("path")
            .attr("class","lines")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("d", (d) => line(d.values));

        lines.each((d, i, nodes) => {
            const element = nodes[i];
            const length = element.getTotalLength();
            if(displayedLines[i].list === false){
                svgJP.selectAll("g.circle-group-"+displayedLines[i].name).remove()
                element.remove();
                return;
            }

            d3.select(element)
                .attr("stroke-dasharray", `${length},${length}`)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration(750)
                .attr("stroke", colors[i])
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

            const circles = svgJP
                .selectAll(".circle")
                .data(d.values)
                .enter()
                .append("g")
                .attr("class", "circle-group-"+displayedLines[i].name)

            circles
                .append("circle")
                .attr("cx", (d) => xScaleJP(d.xValue))
                .attr("cy", (d) => yScaleJP(d.yValue))
                .attr("r", 5)
                .attr("fill", colors[i])
                .append("title")
                .text((text) => `Genre: ${d.label} \n Year: ${text.xValue}, Amount: ${text.yValue} (/100 people)`);
        });
    }
    const generateRandomColors = () =>{
        for(let i= 0; i< displayData["EU"].length; i++){
            colors.push(randomColor())
        }
    }
    return <div style={{textAlign:"center"}}>
        <h1>Global sales multiline diagram for {type}</h1>
        <div className={"lines"} style={{display:"flex",justifyContent:"center",flexWrap:"wrap"}}>
            {colors.length > 0 && displayedLines.map((displayedLine,index)=>{
                return <div key={index} style={{marginLeft:10,marginRight:10}}>
                    <h3>{displayedLine.name}</h3>
                    <input type={"color"} style={{padding:0,border:0}} disabled value={colors[index]}/>
                    <input type={"checkbox"} style={{width:20,height:20}} checked={displayedLine.list} onChange={()=>{
                        const updatedData = [...displayedLines]
                        updatedData[index].list = !updatedData[index].list;
                        setDisplayedLines(updatedData)
                    }}/>
                </div>
            })}
        </div>
        <div style={{width:"100%",display:"flex",flexWrap:"wrap"}}>
            <div style={{width:"50%"}}>
                <h3>EU sales/population</h3>
                <svg ref={svgEURef} width={"100%"} height={600}></svg>
            </div>
            <div style={{width:"50%"}}>
                <h3>NA sales/population</h3>
                <svg ref={svgNARef} width={"100%"} height={600}></svg>
            </div>
            <div style={{width:"50%"}}>
                <h3>JP sales/population</h3>
                <svg ref={svgJPRef} width={"100%"} height={600}></svg>
            </div>
        </div>
    </div>
}