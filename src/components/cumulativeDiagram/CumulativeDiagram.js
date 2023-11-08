import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as d3 from 'd3';

export default function CumulativeDiagram({data, label,merge = false}) {
    const svgRef = useRef();
    const margin = useMemo(() => {
        return {top: 20, right: 30, bottom: 40, left: 40}
    }, []);
    const width = 1500;
    const height = 600;
    const tooltipRef = useRef();
    useEffect(() => {
        if (data && data.length > 0) {
            if (merge) {
               mergeEachRegion();
            } else {
                multilineDiagramEachRegion()
            }
        }
    }, [data]);

    const multilineDiagramEachRegion = () => {
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
            .range([margin.left, width - margin.right - 100]);
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
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style('opacity', 0.9);
                    tooltip.html(`Genre: ${genre}<br>Year: ${d.Year}<br>Value: ${d.value.toFixed(2)} (millio)`)
                        .style('left', `${event.pageX}px`)
                        .style('top', `${event.pageY}px`);
                })
                .on("mouseout", function () {
                    tooltip.transition().duration(500).style('opacity', 0);
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
        })
    }
    const mergeEachRegion = () => {
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

        const reducedDataEU = d3.rollup(data, v => d3.sum(v, d => +d["EU_Sales"]), d => d.Year, d => d.Genre);
        const reducedDataNA = d3.rollup(data, v => d3.sum(v, d => +d["NA_Sales"]), d => d.Year, d => d.Genre);
        const reducedDataJP = d3.rollup(data, v => d3.sum(v, d => +d["JP_Sales"]), d => d.Year, d => d.Genre);
        const genres = Array.from(new Set(data.map(x => x.Genre)))
        const formattedDataEU = Array.from(reducedDataEU, ([year, genreSales]) => {
            const yearObject = {Year: year};
            for (const [genre, sales] of genreSales) {
                yearObject[genre] = sales;
            }
            return yearObject;
        });
        const formattedDataNA = Array.from(reducedDataNA, ([year, genreSales]) => {
            const yearObject = {Year: year};
            for (const [genre, sales] of genreSales) {
                yearObject[genre] = sales;
            }
            return yearObject;
        });
        const formattedDataJP = Array.from(reducedDataJP, ([year, genreSales]) => {
            const yearObject = {Year: year};
            for (const [genre, sales] of genreSales) {
                yearObject[genre] = sales;
            }
            return yearObject;
        });


        genres.map(x => {
            let prevValueEU = 0;
            let prevValueNA = 0;
            let prevValueJP = 0;
            for (let i = 0; i < formattedDataEU.length; i++) {
                let dataEU = formattedDataEU[i];
                if (!dataEU[x]) {
                    dataEU[x] = 0;
                }
                let prevYear = (Number(dataEU.Year) - 1).toString();
                prevValueEU = findPrevValue(formattedDataEU, prevYear, x);
                dataEU[x] += prevValueEU;
            }
            for (let i = 0; i < formattedDataNA.length; i++) {
                let dataNA = formattedDataNA[i];
                if (!dataNA[x]) {
                    dataNA[x] = 0;
                }
                let prevYear = (Number(dataNA.Year) - 1).toString();
                prevValueNA = findPrevValue(formattedDataNA, prevYear, x);
                dataNA[x] += prevValueNA;
            }

            for (let i = 0; i < formattedDataJP.length; i++) {
                let dataJP = formattedDataJP[i];
                if (!dataJP[x]) {
                    dataJP[x] = 0;
                }
                let prevYear = (Number(dataJP.Year) - 1).toString();
                prevValueJP = findPrevValue(formattedDataJP, prevYear, x);
                dataJP[x] += prevValueJP;
            }
        })

        const xScale = d3
            .scaleLinear()
            .domain([d3.min(formattedDataEU, d => parseInt(d.Year, 10)), d3.max(formattedDataEU, d => parseInt(d.Year, 10))])
            .range([margin.left, width - margin.right - 100]);
        const xTicks = xScale.domain()[1] - xScale.domain()[0];

        const yScale = d3.scaleLinear()
            .domain([0,
                d3.max([d3.max(formattedDataEU, d => d3.max(genres, (genre) => d[genre])),
                    d3.max(formattedDataNA, d => d3.max(genres, (genre) => d[genre])),
                    d3.max(formattedDataJP, d => d3.max(genres, (genre) => d[genre]))])
            ])
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
                const line = d3.line()
                    .x((d) => xScale(+d.Year))
                    .y((d) => yScale(d.value));

                const genreDataEU = formattedDataEU.map((d) => ({
                    Year: d.Year, value: d[genre],
                }));

                const genreDataNA = formattedDataNA.map((d) => ({
                    Year: d.Year, value: d[genre],
                }));

                const genreDataJP = formattedDataJP.map((d) => ({
                    Year: d.Year, value: d[genre],
                }));


                group.append("path")
                    .datum(genreDataEU)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", colors(genre))
                    .attr("stroke-width", 3)
                    .attr("d", line);

                group.selectAll(".circle")
                    .data(genreDataEU)
                    .enter()
                    .append("circle")
                    .attr("class", "circle")
                    .attr("cx", (d) => xScale(+d.Year))
                    .attr("cy", (d) => yScale(d.value))
                    .attr("r", 5)
                    .attr("fill", colors(genre))
                    .on("mouseover", function (event, d) {
                        tooltip.transition().duration(200).style('opacity', 0.9);
                        tooltip.html(`Genre: ${genre}<br>Year: ${d.Year}<br>Value: ${d.value.toFixed(2)} (millio)`)
                            .style('left', `${event.pageX}px`)
                            .style('top', `${event.pageY}px`);
                    })
                    .on("mouseout", function () {
                        tooltip.transition().duration(500).style('opacity', 0);
                    });

                group.append("path")
                    .datum(genreDataNA)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", colors(genre))
                    .attr("stroke-width", 3)
                    .attr("d", line);
                group.selectAll(".triangle")
                    .data(genreDataNA)
                    .enter()
                    .append("polygon")
                    .attr("class", "triangle")
                    .attr("points", (d) => {
                        const x = xScale(+d.Year);
                        const y = yScale(d.value);
                        return `${x},${y - 5} ${x - 5},${y + 5} ${x + 5},${y + 5}`;
                    })
                    .attr("fill", colors(genre))
                    .on("mouseover", function (event, d) {
                        tooltip.transition().duration(200).style('opacity', 0.9);
                        tooltip.html(`Genre: ${genre}<br>Year: ${d.Year}<br>Value: ${d.value.toFixed(2)} (millio)`)
                            .style('left', `${event.pageX}px`)
                            .style('top', `${event.pageY}px`);
                    })
                    .on("mouseout", function () {
                        tooltip.transition().duration(500).style('opacity', 0);
                    });

                group.append("path")
                    .datum(genreDataJP)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", colors(genre))
                    .attr("stroke-width", 3)
                    .attr("d", line);
                group.selectAll(".rectangle")
                    .data(genreDataJP)
                    .enter()
                    .append("rect") // Use rect instead of polygon
                    .attr("class", "rectangle")
                    .attr("x", (d) => xScale(+d.Year) - 5) // Adjust x position
                    .attr("y", (d) => yScale(d.value) - 5) // Adjust y position
                    .attr("width", 10) // Set the width of the rectangle
                    .attr("height", 10) // Set the height of the rectangle
                    .attr("fill", colors(genre))
                    .on("mouseover", function (event, d) {
                        tooltip.transition().duration(200).style('opacity', 0.9);
                        tooltip.html(`Genre: ${genre}<br>Year: ${d.Year}<br>Value: ${d.value.toFixed(2)} (millio)`)
                            .style('left', `${event.pageX}px`)
                            .style('top', `${event.pageY}px`);
                    })
                    .on("mouseout", function () {
                        tooltip.transition().duration(500).style('opacity', 0);
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
        )
    }

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