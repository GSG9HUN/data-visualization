import {useEffect, useRef} from "react";
import * as d3 from "d3";
import {Sales} from "../../utils/salesEnum";

export default function Histogram({data, label, type}) {
    const ref = useRef();
    const tooltipRef = useRef();
    useEffect(() => {

        const svg = d3.select(ref.current);

        svg.selectAll('svg > *').remove();

        const margin = {top: 20, right: 30, bottom: 40, left: 40};

        const sales = d3.rollup(data, (v) => d3.sum(v, (d) => parseFloat(d[label])), (d) => d[type]);
        let height = 400;
        let svgWidth = window.innerWidth - margin.left - margin.right;
        let svgHeight = 400;

        svg.attr('width', svgWidth).attr('height', svgHeight);

        const salesData = Array.from(sales, ([label, totalSales]) => ({
            [type]:label, totalSales,
        })).filter(x => x.totalSales > 0);

        salesData.sort((a, b) => b.totalSales - a.totalSales);

        const xScale = d3
            .scaleBand()
            .domain(salesData.map((d) => d[type]))
            .range([margin.left, svgWidth - margin.right])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(salesData, (d) => d.totalSales)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const tooltip = d3.select(tooltipRef.current)
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0);


        svg.selectAll('rect')
            .data(salesData)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d[type]))
            .attr('y', (d) => yScale(d.totalSales))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => yScale(0) - yScale(d.totalSales))
            .attr('fill', 'steelblue').on('mouseover', (event, d) => {
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`${type}: ${d[type]}<br>${Sales[label]}: ${d.totalSales.toFixed(2)} (million)`)
                .style('left', `${event.pageX}px`)
                .style('top', `${event.pageY}px`);
            }).on('mouseout', () => {
                tooltip.transition().duration(500).style('opacity', 0);
            });

        const xAxis = d3.axisBottom(xScale);

        if (salesData.length > 20) {
            xAxis.tickValues([])
        }

        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,0)`)
            .call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        svg
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);

    }, [data,label,type])


    return <div className={"container"} style={{width: "auto",textAlign:"center"}}>
        <h1 style={{margin: "auto"}}>This is the {Sales[label]} histogram</h1>
        <div ref={tooltipRef}></div>

        <svg ref={ref} className={label}></svg>
    </div>
}