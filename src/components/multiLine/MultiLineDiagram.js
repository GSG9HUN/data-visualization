import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import randomColor from "randomcolor";
const colors = [];
let xScale;
let yScale;
let svg;

export default function MultiLineDiagram({displayData, type}) {

    const svgRef = useRef();
    const [displayedLines, setDisplayedLines] = useState([])

    useEffect(() => {
        generateRandomColors();

        const margin = {top: 50, right: 50, bottom: 50, left: 50};
        const width = 1500 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        xScale = d3
            .scaleLinear()
            .domain([
                d3.min(displayData, (d) => d3.min(d.values, v => +v.xValue)),
                d3.max(displayData, (d) => d3.max(d.values, v => +v.xValue))
            ])
            .range([50, width]);

        yScale = d3
            .scaleLinear()
            .domain([
                d3.min(displayData, (d) => d3.min(d.values, v => +v.yValue)),
                d3.max(displayData, (d) => d3.max(d.values, v => +v.yValue))
            ])
            .range([height, 0]);

        const svgEl = d3.select(svgRef.current);
        svgEl.selectAll("*").remove();

        svg = svgEl
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xTicks = xScale.domain()[1] - xScale.domain()[0];
        const xAxis = d3
            .axisBottom(xScale)
            .ticks(xTicks)
            .tickFormat(x => Number(x));

        const xAxisGroup = svg
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
            .axisLeft(yScale)
            .ticks(10)
            .tickFormat(x => Number(x));

        const yAxisGroup = svg.append("g").call(yAxis);
        yAxisGroup.select(".domain").remove();
        yAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");

        svg
            .append("rect")
            .attr("width", width+50)
            .attr("height", height)
            .attr("fill", "#03001C");
        createLineNames();
    }, [displayData]);

    useEffect(()=>{
        createLines()
    },[displayedLines])

    const generateRandomColors = () =>{
        for(let i= 0; i< displayData.length; i++){
            colors.push(randomColor())
        }
    }

    const createLines = () =>{
        if(!displayedLines.length){
            return;
        }
        svg.selectAll("path.lines").remove();
        const line = d3
            .line()
            .x((d) => xScale(d.xValue))
            .y((d) => yScale(d.yValue));


        const lines = svg
            .selectAll(".line")
            .data(displayData)
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
                svg.selectAll("g.circle-group-"+displayedLines[i].name).remove()
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


            const circles = svg
                .selectAll(".circle")
                .data(d.values)
                .enter()
                .append("g")
                .attr("class", "circle-group-"+displayedLines[i].name)

            circles
                .append("circle")
                .attr("cx", (d) => xScale(d.xValue))
                .attr("cy", (d) => yScale(d.yValue))
                .attr("r", 5)
                .attr("fill", colors[i])
                .append("title")
                .text((text) => `${type}: ${d.label} \n Year: ${text.xValue}, Amount: ${text.yValue} (in million)`);
        });
    }

    const createLineNames = () => {
        const lineNames =[]
        for(let i=0;i<displayData.length;i++){
            lineNames.push({name:displayData[i].label,list:true});
        }
        setDisplayedLines(lineNames)
    }

    return (
        <div style={{textAlign:"center"}}>
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
            <svg ref={svgRef} width={1500} height={600}></svg>
        </div>
    );

}