import {Box} from "@mui/material";
import Histogram from "./histogram/Histogram";
import CircleDiagram from "./circleDiagram/CircleDiagram";
import React from "react";
import StackDiagram from "./stackDiagram/StackDiagram";

export default function Diagrams({displayData, type, diagramType}) {
    return <div className={"graphs"} style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
    }}>
        {diagramType !== "StackDiagram" ? <div>
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
        </div>:<Box className={"stackDiagram"} style={{width:"100%",margin:"auto",textAlign:"center"}}>
            <StackDiagram data={displayData} type={"Genre"}></StackDiagram>
        </Box>}
    </div>
}