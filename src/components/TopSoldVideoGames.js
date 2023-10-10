import React, {useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {getDataForDiagram} from "../utils/getDataForDiagram";
import Histogram from "./histogram/Histogram";
import CircleDiagram from "./circleDiagram/CircleDiagram";

export function TopSoldVideoGames({yearList, data}) {
    const [year, setYear] = useState("----");
    const [type, setType] = useState("----");
    const [diagramType,setDiagramType] = useState("Histogram")
    const [displayData, setDisplayData] = useState([]);

    useEffect(() => {
        setDisplayData(getDataForDiagram(data, year, type))
    }, [year, type])

    function handleChangeYear(e) {
        setYear(e.target.value)
    }

    function handleDiagramChange(e) {
        setDiagramType(e.target.value)
    }
    function handleChangeType(e) {
        setType(e.target.value)
    }

    return <div className={"container"}>
        <div style={{display: "flex"}}>
            <Box style={{margin: "15px"}}>
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
            </Box>
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
                        <MenuItem value="Name">
                            <em>VideoGame</em>
                        </MenuItem>
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
            </Box>
            <Box style={{margin: "15px"}}>
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
                        <MenuItem value={"3"}>
                            <em>valami még</em>
                        </MenuItem>
                    </Select>

                </FormControl>
            </Box>
        </div>
        {displayData.length && <div className={"graphs"} style={{width:"100%",display: "flex",flexWrap:"wrap", justifyContent:"space-between"}}>
            <Box id={"eu"}>
                {diagramType === "Histogram" ?<Histogram data={displayData} label={"EU_Sales"} type={type!=='----'?type:"Publisher"}/>: diagramType ==="Circle" ?
                <CircleDiagram data={displayData} label={"EU_Sales"} type={type!=='----'?type:"Publisher"}/>:"még semmi"}
            </Box>
            <Box id={"na"}>
                {diagramType === "Histogram" ?<Histogram data={displayData} label={"NA_Sales"} type={type!=='----'?type:"Publisher"}/>:  diagramType ==="Circle" ?
                    <CircleDiagram data={displayData} label={"NA_Sales"} type={type!=='----'?type:"Publisher"}/>:"még semmi"}
            </Box>
            <Box id={"jp"}>
                {diagramType === "Histogram" ?<Histogram data={displayData} label={"JP_Sales"} type={type!=='----'?type:"Publisher"}/>:  diagramType ==="Circle" ?
                    <CircleDiagram data={displayData} label={"JP_Sales"} type={type!=='----'?type:"Publisher"}/>:"még semmi"}
            </Box>
            <Box id={"global"}>
                {diagramType === "Histogram" ?<Histogram data={displayData} label={"Global_Sales"} type={type!=='----'?type:"Publisher"}/>:  diagramType ==="Circle" ?
                    <CircleDiagram data={displayData} label={"Global_Sales"} type={type!=='----'?type:"Publisher"}/>:"még semmi"}
            </Box>
        </div>}
    </div>
}