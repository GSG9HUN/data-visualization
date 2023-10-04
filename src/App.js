import responseData from "./utils/readingCSV";
import React, {useEffect, useState} from "react";
import {TopSoldVideoGames} from "./components/TopSoldVideoGames";
import formatData from "./utils/formatData";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

function App() {
    const [data, setData] = useState("");
    const [yearList,setYearList] = useState([]);
    const [year,setYear] = useState("");
    useEffect(() => {
        if (data !== "") {
            return
        }

        let [formattedData,years] = formatData(responseData);
        setData(formattedData)
        setYearList(years);
    }, [data])


    function handleChange(e) {
        setYear(e.target.value)
    }
    return (
        <React.Fragment>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={year}
                    onChange={handleChange}
                    autoWidth
                    label="Year"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {yearList.map((yearElement,index)=>{
                        return <MenuItem key={index} value={yearElement}>{yearElement}</MenuItem>
                    })}
                </Select>
            </FormControl>
            <TopSoldVideoGames year={year}/>

        </React.Fragment>);
}

export default App;
