import responseData from "./utils/readingCSV";
import React, {useEffect, useState} from "react";
import {TopSoldVideoGames} from "./components/TopSoldVideoGames";
import formatData from "./utils/formatData";
import {Button} from "@mui/material";
import RenderDataTable from "./components/RenderDataTable";

function App() {
    const [data, setData] = useState("");
    const [isVisualization,setVisualization] = useState(false);
    const [columns,setColumns] = useState("")
    const [yearList,setYearList] = useState([]);

    useEffect(() => {
        if (data !== "") {
            return
        }

        let [formattedData,years,columns] = formatData(responseData);
        setData(formattedData)
        setYearList(years);
        setColumns(columns)
    }, [data])


    return (
        <React.Fragment>
            {!isVisualization && <RenderDataTable columns={columns} data={data}></RenderDataTable>}
            <div style={{display:"flex",justifyContent:"center", margin:"10px"}}>
                <Button style={{margin:"auto"}} variant={"outlined"} onClick={()=>setVisualization(!isVisualization)}>{!isVisualization?"Visualize this data.":"See the data again."}</Button>
            </div>
            {isVisualization && <TopSoldVideoGames yearList={yearList} data={data}/>}

        </React.Fragment>);
}

export default App;
