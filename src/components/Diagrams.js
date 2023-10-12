import {Box} from "@mui/material";
import Histogram from "./histogram/Histogram";
import CircleDiagram from "./circleDiagram/CircleDiagram";
import React from "react";

export default function Diagrams ({displayData,type,diagramType}){
    return <div className={"graphs"} style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
    }}>
        <Box id={"eu"}>
            {diagramType === "Histogram" ? <Histogram data={displayData} label={"EU_Sales"}
                                                      type={type !== '----' ? type : "Publisher"}/> : diagramType === "Circle" ?
                <CircleDiagram data={displayData} label={"EU_Sales"}
                               type={type !== '----' ? type : "Publisher"}/> : "még semmi"}
        </Box>
        <Box id={"na"}>
            {diagramType === "Histogram" ? <Histogram data={displayData} label={"NA_Sales"}
                                                      type={type !== '----' ? type : "Publisher"}/> : diagramType === "Circle" ?
                <CircleDiagram data={displayData} label={"NA_Sales"}
                               type={type !== '----' ? type : "Publisher"}/> : "még semmi"}
        </Box>
        <Box id={"jp"}>
            {diagramType === "Histogram" ? <Histogram data={displayData} label={"JP_Sales"}
                                                      type={type !== '----' ? type : "Publisher"}/> : diagramType === "Circle" ?
                <CircleDiagram data={displayData} label={"JP_Sales"}
                               type={type !== '----' ? type : "Publisher"}/> : "még semmi"}
        </Box>
        <Box id={"global"}>
            {diagramType === "Histogram" ? <Histogram data={displayData} label={"Global_Sales"}
                                                      type={type !== '----' ? type : "Publisher"}/> : diagramType === "Circle" ?
                <CircleDiagram data={displayData} label={"Global_Sales"}
                               type={type !== '----' ? type : "Publisher"}/> : "még semmi"}
        </Box>
    </div>
}