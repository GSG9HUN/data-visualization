import React, {useEffect, useMemo, useRef} from 'react';
import * as d3 from 'd3';

export default function CumulativeDiagram({data, label}) {
    const svgRef = useRef();

    const margin = useMemo(() => {
        return {top: 20, right: 30, bottom: 40, left: 40}
    }, []);
    const tooltipRef = useRef();
    useEffect(() => {
        if (data && data.length > 0) {
            const width = 1500;
            const height = 600;

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height);

            svg.selectAll("*").remove();

            const tooltip = d3.select(tooltipRef.current)
                .style('position', 'absolute')
                .style('padding', '10px')
                .style('background-color', 'white')
                .style('border', '1px solid #ccc')
                .style('border-radius', '5px')
                .style('pointer-events', 'none')
                .style('opacity', 0);
            const reducedData = d3.rollup(data, v => d3.sum(v, d => +d[label]), d => d.Year, d => d.Genre);
            const genres = Array.from(new Set(data.map(x => x.Genre)))
            const formattedData = Array.from(reducedData, ([year, genreSales]) => {
                const yearObject = {Year: year};
                for (const [genre, sales] of genreSales) {
                    yearObject[genre] = sales;
                }
                return yearObject;
            });
            genres.map(x => {
                let prevValue = 0;
                for (let i = 0; i < formattedData.length; i++) {
                    let data = formattedData[i];
                    if (!data[x]) {
                        data[x] = 0;
                    }
                    let prevYear = (Number(data.Year) - 1).toString();
                    prevValue = findPrevValue(formattedData, prevYear, x);
                    data[x] += prevValue;
                }
            })

            const xScale = d3
                .scaleLinear()
                .domain([d3.min(formattedData, d => parseInt(d.Year, 10)), d3.max(formattedData, d => parseInt(d.Year, 10))])
                .range([margin.left, width - margin.right-100]);
            const xTicks = xScale.domain()[1] - xScale.domain()[0];

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(formattedData, d => d3.max(genres, (genre) => d[genre]))])
                .range([height - margin.bottom, margin.top]);

            const colors = d3.scaleOrdinal(d3.schemeCategory10);

            const xAxis = d3.axisBottom(xScale)
                .ticks(xTicks)
                .tickFormat(x => Number(x));

            svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${height - margin.bottom})`)
                .call(xAxis);

            const yAxis = d3.axisLeft(yScale);

            svg.append('g')
                .attr('class', 'y-axis')
                .attr('transform', `translate(${margin.left}, 0)`)
                .call(yAxis);

            const genreGroups = svg.selectAll(".genre-group")
                .data(genres)
                .enter()
                .append("g")
                .attr("class", "genre-group");

            genreGroups.each(function (genre) {
                const group = d3.select(this);
                const genreData = formattedData.map((d) => ({
                    Year: d.Year, value: d[genre],
                }));

                const line = d3.line()
                    .x((d) => xScale(+d.Year))
                    .y((d) => yScale(d.value));

                group.append("path")
                    .datum(genreData)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", colors(genre))
                    .attr("stroke-width", 3)
                    .attr("d", line);

                group.selectAll(".circle")
                    .data(genreData)
                    .enter()
                    .append("circle")
                    .attr("class", "circle")
                    .attr("cx", (d) => xScale(+d.Year))
                    .attr("cy", (d) => yScale(d.value))
                    .attr("r", 5)
                    .attr("fill", colors(genre))
                    .on("mouseover", function (event,d) {
                        tooltip.transition().duration(200).style('opacity', 0.9);
                        tooltip.html(`Genre: ${genre}<br>Year: ${d.Year}<br>Value: ${d.value.toFixed(2)} (millio)`)
                            .style('left', `${event.pageX}px`)
                            .style('top', `${event.pageY}px`);
                    })
                    .on("mouseout", function () {
                        tooltip.transition().duration(500).style('opacity', 0);
                    });
            });

            const legend = svg.append("g")
                .selectAll("g")
                .data(genres)
                .enter()
                .append("g")
                .attr("transform", (d, i) => `translate(0,${i * 20})`);

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", (d) => colors(d));

            legend.append("text")
                .attr("x", width - 15)
                .attr("y", 9)
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text((d) => d);


        }
    }, [data]);


    const findPrevValue = (formattedData, prevYear, genre) => {
        let value = formattedData.filter(x => x.Year === prevYear);
        return value.length > 0 ? value[0][genre] ?? 0 : 0;
    }
    return (<React.Fragment>
        <div style={{marginBottom: "2rem"}}>
            <h1 style={{margin: "auto"}}>This is the cumulative diagram for {label}</h1>
            <div ref={tooltipRef}></div>
            <svg style={{marginTop: 50}} ref={svgRef}/>
        </div>
    </React.Fragment>);
}