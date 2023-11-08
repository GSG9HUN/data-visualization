import {Box} from "@mui/material";
import Histogram from "./histogram/Histogram";
import CircleDiagram from "./circleDiagram/CircleDiagram";
import React, {useState} from "react";
import StackDiagram from "./stackDiagram/StackDiagram";
import CumulativeDiagram from "./cumulativeDiagram/CumulativeDiagram";
import StackAreaDiagram from "./stackAreaDiagram/StackAreaDiagram";

export default function Diagrams({displayData, type, diagramType}) {

    const [merge,setMerge] = useState(false);

    const handleChange = (e) =>{
        setMerge(!merge);
    }

    return <div className={"graphs"} style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
    }}>
        {diagramType !== "StackDiagram" && diagramType !== "CumulativeDiagram" && <div style={{display:"inherit", flexWrap:"inherit",justifyContent:"inherit"}}>
            <Box id={"eu"}>
                {diagramType === "Histogram" ? <Histogram data={displayData} label={"EU_Sales"}
                                                          type={type !== '----' ? type : "Publisher"}/> : diagramType === "Circle" ?
                    <CircleDiagram data={displayData} label={"EU_Sales"}
                                   type={type !== '----' ? type : "Publisher"}/> : ""}
            </Box>
            <Box id={"na"}>
                {diagramType === "Histogram" ? <Histogram data={displayData} label={"NA_Sales"}
                                                          type={type !== '----' ? type : "Publisher"}/> : diagramType === "Circle" ?
                    <CircleDiagram data={displayData} label={"NA_Sales"}
                                   type={type !== '----' ? type : "Publisher"}/> : ""}
            </Box>
            <Box id={"jp"}>
                {diagramType === "Histogram" ? <Histogram data={displayData} label={"JP_Sales"}
                                                          type={type !== '----' ? type : "Publisher"}/> : diagramType === "Circle" ?
                    <CircleDiagram data={displayData} label={"JP_Sales"}
                                   type={type !== '----' ? type : "Publisher"}/> : ""}
            </Box>
            <Box id={"global"}>
                {diagramType === "Histogram" ? <Histogram data={displayData} label={"Global_Sales"}
                                                          type={type !== '----' ? type : "Publisher"}/> : diagramType === "Circle" ?
                    <CircleDiagram data={displayData} label={"Global_Sales"}
                                   type={type !== '----' ? type : "Publisher"}/> : ""}
            </Box>
        </div>}
        {diagramType === "StackDiagram" && <Box className={"stackDiagram"} style={{width:"100%",margin:"auto",textAlign:"center"}}>
            <StackDiagram data={displayData} type={"Genre"}></StackDiagram>
        </Box>}
        {diagramType === "CumulativeDiagram" && (<div>
            <input type={"checkbox"} onChange={handleChange} checked={merge}/>
            <label>Merge charts</label>
            {!merge ? <div>
                <Box className={"CumulativeDiagram"} style={{width: "100%", margin: "auto", textAlign: "center"}}>
                    <CumulativeDiagram data={displayData} label={"EU_Sales"}></CumulativeDiagram>
                </Box>
                <Box className={"CumulativeDiagram"} style={{width: "100%", margin: "auto", textAlign: "center"}}>
                    <CumulativeDiagram data={displayData} label={"NA_Sales"}></CumulativeDiagram>
                </Box>
                <Box className={"CumulativeDiagram"} style={{width: "100%", margin: "auto", textAlign: "center"}}>
                    <CumulativeDiagram data={displayData} label={"JP_Sales"}></CumulativeDiagram>
                </Box>
            </div> : <Box className={"CumulativeDiagram"} style={{width: "100%", margin: "auto", textAlign: "center"}}>
                <CumulativeDiagram data={displayData} merge={merge}></CumulativeDiagram>
            </Box>}
        </div>)}

        {diagramType === "StackAreaDiagram" &&
            <div style={{display:"flex",flexWrap:"wrap"}}>
                <Box className={"CumulativeDiagram"} style={{width:"50%",margin:"auto",textAlign:"center"}}>
                    <StackAreaDiagram data={displayData} label={"EU_Sales"}></StackAreaDiagram>
                </Box>
                <Box className={"CumulativeDiagram"} style={{width:"50%",margin:"auto",textAlign:"center"}}>
                    <StackAreaDiagram data={displayData} label={"NA_Sales"}></StackAreaDiagram>
                </Box>
                <Box className={"CumulativeDiagram"} style={{width:"50%",margin:"auto",textAlign:"center"}}>
                    <StackAreaDiagram data={displayData} label={"JP_Sales"}></StackAreaDiagram>
                </Box>
            </div>}
    </div>
}