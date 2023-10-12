import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import randomColor from "randomcolor";

export default function MultiLineDiagram({displayData, label, type}) {

    const svgRef = useRef();
    //TODO: implement to remove some lines from the chart
    const [displayedLines, setDisplayedLine] = useState([])

    useEffect(() => {
        if (type === "----") {
            return;
        }
        const margin = {top: 50, right: 50, bottom: 50, left: 50};
        const width = 1500 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const xScale = d3
            .scaleLinear()
            .domain([
                d3.min(displayData, (d) => d3.min(d.values, v => +v.xValue)),
                d3.max(displayData, (d) => d3.max(d.values, v => +v.xValue))
            ])
            .range([50, width]);

        const yScale = d3
            .scaleLinear()
            .domain([
                d3.min(displayData, (d) => d3.min(d.values, v => +v.yValue)),
                d3.max(displayData, (d) => d3.max(d.values, v => +v.yValue))
            ])
            .range([height, 0]);

        const svgEl = d3.select(svgRef.current);
        svgEl.selectAll("*").remove();

        const svg = svgEl
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xTicks = xScale.domain()[1] - xScale.domain()[0];
        const yTicks = yScale.domain()[1] - yScale.domain()[0];
        const xAxis = d3
            .axisBottom(xScale)
            .ticks(xTicks).tickSize(55)
            .tickFormat(x => Number(x));

        const xAxisGroup = svg
            .append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
        xAxisGroup.select(".domain").remove();
        xAxisGroup.selectAll("line").attr("stroke", "rgb(255, 0, 0)");
        xAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");
        // Add Y grid lines with labels
        const yAxis = d3
            .axisLeft(yScale)
            .ticks(yTicks)
            .tickSize(55)
            .tickFormat(x => Number(x));

        const yAxisGroup = svg.append("g").call(yAxis);
        yAxisGroup.select(".domain").remove();
        yAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "red")
            .attr("font-size", "0.75rem");


        const line = d3
            .line()
            .x((d) => xScale(d.xValue))
            .y((d) => yScale(d.yValue));

        const lines = svg
            .selectAll(".line")
            .data(displayData)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("d", (d) => line(d.values));

        lines.each((d, i, nodes) => {

            const element = nodes[i];
            const length = element.getTotalLength();
            const color = randomColor();
            d3.select(element)
                .attr("stroke-dasharray", `${length},${length}`)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration(750)
                .attr("stroke", color)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        });
    }, [displayData]);


    return (
        <div>
            <svg ref={svgRef} width={1500} height={600}></svg>
        </div>
    );

}