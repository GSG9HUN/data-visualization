import React, {useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {getDataForDiagram} from "../utils/getDataForDiagram";
import Histogram from "./histogram/Histogram";

export function TopSoldVideoGames({yearList, data}) {
    const [year, setYear] = useState("----");
    const [type, setType] = useState("----");
    const [displayData, setDisplayData] = useState([]);

    useEffect(() => {
        setDisplayData(getDataForDiagram(data, year, type))
    }, [year, type])

    function handleChangeYear(e) {
        setYear(e.target.value)
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
                    </Select>

                </FormControl>
            </Box>
        </div>
        {displayData.length && <div className={"graphs"} style={{display: "flex",flexWrap:"wrap"}}>
            <Box>
                <Histogram data={displayData} label={"EU_Sales"} type={type!=='----'?type:"Publisher"}/>
            </Box>
            <Box>
                <Histogram data={displayData} label={"NA_Sales"} type={type!=='----'?type:"Publisher"}/>
            </Box>
            <Box>
                <Histogram data={displayData} label={"JP_Sales"} type={type!=='----'?type:"Publisher"}/>
            </Box>
            <Box>
                <Histogram data={displayData} label={"Global_Sales"} type={type!=='----'?type:"Publisher"}/>
            </Box>
        </div>}
    </div>
}