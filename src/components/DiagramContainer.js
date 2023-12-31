import React, {useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {getDataForDiagram, getDataForStackAreaDiagram} from "../utils/getDataForDiagram";
import Diagrams from "./Diagrams";
import MultiLineDiagram from "./multiLine/MultiLineDiagram";
import PopulationDiagram from "./PopulationDiagram/PopulationDiagram";

export function DiagramContainer({yearList, data, isMultiLine = false, isDependingOnPop = false}) {
    const [year, setYear] = useState("----");
    const [type, setType] = useState("----");
    const [diagramType, setDiagramType] = useState("Histogram")
    const [displayData, setDisplayData] = useState([]|{});

    useEffect(() => {
        setDisplayData(getDataForDiagram(data, isMultiLine, year, type,isDependingOnPop))
    }, [year])

    function handleChangeYear(e) {
        setYear(e.target.value)
    }
    function handleDiagramChange(e) {
        if (e.target.value === "StackAreaDiagram") {
            const euData = getDataForStackAreaDiagram(data, "EU_Sales");
            const naData = getDataForStackAreaDiagram(data, "NA_Sales");
            const jpData = getDataForStackAreaDiagram(data, "JP_Sales");
            setDisplayData([{"EU_Sales": euData}, {"NA_Sales": naData}, {"JP_Sales": jpData}]);
        } else {
            setDisplayData(getDataForDiagram(data, isMultiLine, "----", "----"))
        }
        setDiagramType(e.target.value)
    }

    function handleChangeType(e) {
        setDisplayData(getDataForDiagram(data, isMultiLine, year, e.target.value))
        setType(e.target.value)
    }

    return <div className={"container"}>
        <div style={{display: "flex"}}>
            {diagramType !== "StackAreaDiagram" && !isDependingOnPop && <Box style={{margin: "15px"}}>
                <FormControl>
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                        labelId="year-select-label"
                        id="year-select"
                        value={year}
                        onChange={handleChangeYear}
                        autoWidth
                        label="Year"
                    >
                        <MenuItem value="----">
                            <em>None</em>
                        </MenuItem>
                        {yearList.map((yearElement, index) => {
                            return <MenuItem key={index} value={yearElement}>{yearElement}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Box>}
            {diagramType !== "StackDiagram" && diagramType !== "StackAreaDiagram" && !isDependingOnPop &&
                <Box style={{margin: "15px"}}>
                    <FormControl>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            id="type-select"
                            value={type}
                            label="Type"
                            onChange={handleChangeType}
                        >
                            <MenuItem value="----">
                                <em>None</em>
                            </MenuItem>
                            {!isMultiLine && <MenuItem value="Name">
                                <em>VideoGame</em>
                            </MenuItem>}
                            <MenuItem value="Publisher">
                                <em>Publisher</em>
                            </MenuItem>
                            <MenuItem value="Platform">
                                <em>Platform</em>
                            </MenuItem>
                            <MenuItem value="Genre">
                                <em>Genre</em>
                            </MenuItem>
                        </Select>

                    </FormControl>
                </Box>}
            {!isMultiLine && <Box style={{margin: "15px"}}>
                <FormControl>
                    <InputLabel id="diagram-select-label">DiagramType</InputLabel>
                    <Select
                        labelId="diagram-select-label"
                        id="diagram-select"
                        value={diagramType}
                        label="Type"
                        onChange={handleDiagramChange}
                    >
                        <MenuItem value={"Histogram"}>
                            <em>Histogram</em>
                        </MenuItem>
                        <MenuItem value={"Circle"}>
                            <em>Circle diagram</em>
                        </MenuItem>
                        <MenuItem value={"StackDiagram"}>
                            <em>Stack diagram</em>
                        </MenuItem>
                        <MenuItem value={"CumulativeDiagram"}>
                            <em>Cumulative diagram</em>
                        </MenuItem>
                        <MenuItem value={"StackAreaDiagram"}>
                            <em>Stack area diagram</em>
                        </MenuItem>
                    </Select>

                </FormControl>
            </Box>}
        </div>
        {displayData.length && !isMultiLine &&
            <Diagrams displayData={displayData} type={type} diagramType={diagramType}/>}
        {displayData.values && isMultiLine && type !== "----" &&
            <MultiLineDiagram displayData={displayData} type={type} diagramType={diagramType}/>}

        {displayData["EU"]?.length>0 && isDependingOnPop  &&
            <PopulationDiagram displayData={displayData} type={type}/>}
    </div>
}