import React, {useEffect, useRef} from "react";
import * as d3 from "d3";

export default function StackAreaDiagram({data, label}) {
    const svgRef = useRef(null);
    const width = 800;
    const height = 500-100;
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const keys = ["Shooter", "Misc", "Fighting", "Sports", "Action", "Platform", "Puzzle", "Racing", "Simulation", "Adventure", "Role-Playing", "Strategy",];
    const tooltipRef = useRef();
    useEffect(() => {

        const data1 = data.find(x => x[label] !== undefined);
        // Create an SVG element
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        // Define the keys for the stack layout

        // Create a stack layout
        const stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        // Stack the data
        const series = stack(data1[label]);

        // Set up scales for x and y axes
        const xScale = d3.scaleBand()
            .domain(data1[label].map(d => d.Year))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Create the area generator
        const area = d3.area()
            .x(d => xScale(d.data.Year) + xScale.bandwidth() / 2)
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));
        const tooltip = d3.select(tooltipRef.current)
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0);
        // Append the stack areas to the SVG
        svg.selectAll('path')
            .data(series)
            .enter()
            .append('path')
            .attr('d', area)
            .attr('fill', (d, i) => d3.schemeCategory10[i])
            .on('mouseover', (event, d) => {
                tooltip.transition().duration(200).style('opacity', 0.9);
                //  tooltip.html(`${type}: ${d.data[type]}<br>${d.data["EU_Sales"].toFixed(2)} (million)`)
                const value = d[1] - d[0];
                tooltip.html(`Genre: ${d.key}`)
                    .style('left', `${event.pageX}px`)
                    .style('top', `${event.pageY}px`);
            })
            .on('mouseout', () => {
                tooltip.transition().duration(500).style('opacity', 0);
            })

        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 100}, 20)`);

        keys.forEach((key, i) => {
            legend.append('rect')
                .attr('x', 0)
                .attr('y', i * 20)
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', d3.schemeCategory10[i]);

            legend.append('text')
                .attr('x', 15)
                .attr('y', i * 20 + 10)
                .text(key);
        });
        // Add x and y axes
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(year => year.slice(2,4)));

        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));
    }, []);

    return  <div style={{marginBottom: "2rem"}}>
        <h1 style={{margin: "auto"}}>This is the {label} stacked area diagram</h1>
        <div ref={tooltipRef}></div>
        <svg
            ref={svgRef}
            width={width} // Set the SVG width
            height={height} // Set the SVG height
        />
    </div>
}