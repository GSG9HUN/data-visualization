import {Sales} from "../../utils/salesEnum";
import {useEffect, useRef} from "react";
import * as d3 from "d3";

export default function CircleDiagram ({data,label,type}){

    const ref = useRef();
    const tooltipRef = useRef();
    useEffect(() => {
        const svg = d3.select(ref.current);

        svg.selectAll('svg > *').remove();

        const sales = d3.rollup(data, (v) => d3.sum(v, (d) => parseFloat(d[label])), (d) => d[type]);
        const height = 400;
        const width = 400;

        svg.attr('width', width).attr('height', height);

        const salesData = Array.from(sales, ([label, totalSales]) => ({
            [type]:label, totalSales,
        })).filter(x => x.totalSales > 0);

        const radius = Math.min(width, height) / 2;
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie()
            .value(d => d.totalSales)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const arcs = g.selectAll('.arc')
            .data(pie(salesData))
            .enter().append('g')
            .attr('class', 'arc');

        const tooltip = d3.select(tooltipRef.current)
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0);

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => colorScale(i))
            .on('mouseover', (event, d) => {
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip.html(`${type}: ${d.data[type]}<br>${Sales[label]}: ${d.data.totalSales.toFixed(2)} (million)`)
                    .style('left', `${event.pageX}px`)
                    .style('top', `${event.pageY}px`);
            })
            .on('mouseout', () => {
                tooltip.transition().duration(500).style('opacity', 0);
            });

    }, [data,label,type])

    return <div className={"container"} style={{textAlign:"center"}}>
        <h1 style={{margin: "auto"}}>This is the {Sales[label]} circle diagram</h1>
        <div ref={tooltipRef}></div>

        <svg ref={ref} className={label}></svg>
    </div>
}