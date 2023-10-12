import responseData from "./utils/readingCSV";
import React, {useEffect, useState} from "react";
import {DiagramContainer} from "./components/DiagramContainer";
import formatData from "./utils/formatData";
import {Button} from "@mui/material";
import RenderDataTable from "./components/RenderDataTable";

function App() {
    const [data, setData] = useState("");
    const [isVisualization,setVisualization] = useState(false);
    const [isMultiLineDiagram,setMultiLineDiagram] = useState(false);
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
            {(!isVisualization && !isMultiLineDiagram) && <RenderDataTable columns={columns} data={data}></RenderDataTable>}
            <div style={{display:"flex",justifyContent:"center", margin:"10px"}}>
                {!isMultiLineDiagram && <Button style={{margin: "auto"}} variant={"outlined"}
                         onClick={() => setVisualization(!isVisualization)}>{!isVisualization ? "Visualize this data." : "See the data again."}</Button>
                }
                {!isVisualization && <Button style={{margin: "auto"}} variant={"outlined"}
                                                onClick={() => setMultiLineDiagram(!isMultiLineDiagram)}>{!isMultiLineDiagram ? "Visualize this data in multi line diagram." : "See the data again."}</Button>
                }
            </div>
            {isVisualization && <DiagramContainer yearList={yearList} data={data}/>}
            {isMultiLineDiagram && <DiagramContainer data={data} yearList={yearList} isMultiLine={true}/>}

        </React.Fragment>);
}

export default App;
