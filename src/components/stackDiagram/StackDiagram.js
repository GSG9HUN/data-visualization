import React, {useEffect, useMemo, useRef} from 'react';
import * as d3 from "d3";

export default function StackDiagram({data, type}) {
    const tooltipRef = useRef();
    const colors = useMemo(() => {
        return {"EU_Sales": "#888888", "NA_Sales": "#BF3EFF", "JP_Sales": "#00BFFF"}
    }, []);

    const keys = useMemo(() => ['EU_Sales', 'NA_Sales', 'JP_Sales'], [])
    const svgRef = useRef();
    const margin = useMemo(() => {
        return {top: 20, right: 30, bottom: 40, left: 40}
    }, []);
    useEffect(() => {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        const width = 800, height = 500;
        const aggregatedData = d3.rollup(data, v => ({
            [type]: v[0][type],
            EU_Sales: d3.sum(v, d => +d.EU_Sales),
            NA_Sales: d3.sum(v, d => +d.NA_Sales),
            JP_Sales: d3.sum(v, d => +d.JP_Sales),
        }), d => d[type]);

        const stackGenerator = d3.stack()
            .keys(keys)
        const layers = stackGenerator(aggregatedData.values());
        const extent = [0, d3.max(layers, layer => d3.max(layer, sequence => (sequence[1])))];

        const xScale = d3.scaleBand()
            .domain(data.map(d => d[type]))
            .range([margin.left, width - margin.right])
            .padding(0.15)

        const yScale = d3.scaleLinear()
            .domain(extent)
            .range([height, 0]);

        const tooltip = d3.select(tooltipRef.current)
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0);

        svg
            .selectAll(".layer")
            .data(layers)
            .join("g")
            .attr("class", "layer")
            .attr("fill", layer => colors[layer.key])
            .selectAll("rect")
            .data(layer => layer)
            .join("rect")
            .attr("x", sequence => xScale(sequence.data[type]))
            .attr("width", xScale.bandwidth())
            .attr("y", sequence => yScale(sequence[1]))
            .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]))
            .on('mouseover', (event, d) => {
                tooltip.transition().duration(200).style('opacity', 0.9);
                //  tooltip.html(`${type}: ${d.data[type]}<br>${d.data["EU_Sales"].toFixed(2)} (million)`)
                const value = d[1] - d[0];
                let key;
                switch (value.toFixed(2)) {
                    case d.data["EU_Sales"].toFixed(2):
                        key = "EU_Sales";
                        break;
                    case d.data["NA_Sales"].toFixed(2):
                        key = "NA_Sales";
                        break;
                    case d.data["JP_Sales"].toFixed(2):
                        key = "JP_Sales";
                        break;
                    default:
                        key = "EU_Sales";
                        break;
                }
                tooltip.html(`Region: ${key}<br>${d.data[key].toFixed(2)} (million)`)
                    .style('left', `${event.pageX}px`)
                    .style('top', `${event.pageY}px`);
            })
            .on('mouseout', () => {
                tooltip.transition().duration(500).style('opacity', 0);
            })

        // axes
        const xAxis = d3.axisBottom(xScale);
        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        const yAxis = d3.axisLeft(yScale);
        svg
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);
    }, [colors,margin,type, data, keys]);

    return (<React.Fragment>
        <div style={{marginBottom: "2rem"}}>
            <h1 style={{margin: "auto"}}>This is the {type} stacked histogram</h1>
            <div ref={tooltipRef}></div>
            <svg style={{marginTop: 50}} ref={svgRef} height={550} width={800}/>
        </div>
    </React.Fragment>);
}