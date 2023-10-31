import {Box} from "@mui/material";
import Histogram from "./histogram/Histogram";
import CircleDiagram from "./circleDiagram/CircleDiagram";
import React from "react";
import StackDiagram from "./stackDiagram/StackDiagram";
import CumulativeDiagram from "./cumulativeDiagram/CumulativeDiagram";

export default function Diagrams({displayData, type, diagramType}) {
    return <div className={"graphs"} style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
    }}>
        {diagramType !== "StackDiagram" && diagramType !== "CumulativeDiagram" && <div>
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
        {diagramType === "CumulativeDiagram" &&
            <div>
                <Box className={"CumulativeDiagram"} style={{width:"100%",margin:"auto",textAlign:"center"}}>
                    <CumulativeDiagram data={displayData} label={"EU_Sales"}></CumulativeDiagram>
                </Box>
                <Box className={"CumulativeDiagram"} style={{width:"100%",margin:"auto",textAlign:"center"}}>
                    <CumulativeDiagram data={displayData} label={"NA_Sales"}></CumulativeDiagram>
                </Box>
                <Box className={"CumulativeDiagram"} style={{width:"100%",margin:"auto",textAlign:"center"}}>
                    <CumulativeDiagram data={displayData} label={"JP_Sales"}></CumulativeDiagram>
                </Box>
            </div>}
    </div>
}