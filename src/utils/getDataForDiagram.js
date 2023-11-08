import {deepClone} from "@mui/x-data-grid/utils/utils";

export function getDataForDiagram(data,isMulti=false, year = "", type = "") {
    if (year === "----" && type === "----") {
        return data
    }
    let dataForDiagrams;

    if (type !== "----") {
        dataForDiagrams = data.map((data) => {
            return {
                Year: data.Year,
                [type]: data[type],
                EU_Sales: data.EU_Sales,
                NA_Sales: data.NA_Sales,
                JP_Sales: data.JP_Sales,
                Global_Sales: data.Global_Sales
            }
        })

    }
    if (year !== "----") {
        dataForDiagrams = dataForDiagrams ?
            dataForDiagrams.filter((x => isMulti ? x.Year >= year : x.Year === year)) :
            data.filter((x => isMulti ? x.Year >= year : x.Year === year));
    }

    if(isMulti){
        dataForDiagrams = createDataForMultiLineDiagram(dataForDiagrams,type)
    }
    return dataForDiagrams;
}


function createDataForMultiLineDiagram(data,type){
    let lines = new Map();
    let dataForMultiLineDiagram = []
    data.map((x)=>{
        if(lines.get(x[type])){
            lines.get(x[type]).push({xValue:x.Year,yValue:x.Global_Sales})
        }else{
        lines.set(x[type],[{xValue:x.Year,yValue:x.Global_Sales}]);}
    })

    let lineLabels = lines.keys();
    let label = lineLabels.next();
    while (!label.done){
        const values = lines.get(label.value);
        const valuesSumByYear = [];

        values.forEach(item => {
            const { xValue, yValue } = item;
            const yValueNumber = parseFloat(yValue);

            if (valuesSumByYear[xValue] === undefined) {
                valuesSumByYear[xValue] = yValueNumber;
            } else {
                valuesSumByYear[xValue] += yValueNumber;
            }
        });
        const lineObject = {label:label.value,values:[]}
        valuesSumByYear.map((value,index)=>{
            lineObject.values.push({yValue:value.toFixed(2),xValue:index})
        })
        dataForMultiLineDiagram.push(lineObject)
        label = lineLabels.next();
    }
    return dataForMultiLineDiagram;
}


export function getDataForStackAreaDiagram(data,label){
    const genres ={
        "Shooter":0,
        "Misc":0,
        "Fighting":0,
        "Sports":0,
        "Action":0,
        "Platform":0,
        "Puzzle":0,
        "Racing":0,
        "Simulation":0,
        "Adventure":0,
        "Role-Playing":0,
        "Strategy":0,
    }
    const map = new Map();
    map.set("1980",deepClone(genres))
        .set("1981",deepClone(genres))
        .set("1982",deepClone(genres))
        .set("1983",deepClone(genres))
        .set("1984",deepClone(genres))
        .set("1985",deepClone(genres))
        .set("1986",deepClone(genres))
        .set("1987",deepClone(genres))
        .set("1988",deepClone(genres))
        .set("1989",deepClone(genres))
        .set("1990",deepClone(genres))
        .set("1991",deepClone(genres))
        .set("1992",deepClone(genres))
        .set("1993",deepClone(genres))
        .set("1994",deepClone(genres))
        .set("1995",deepClone(genres))
        .set("1996",deepClone(genres))
        .set("1997",deepClone(genres))
        .set("1998",deepClone(genres))
        .set("1999",deepClone(genres))
        .set("2000",deepClone(genres))
        .set("2001",deepClone(genres))
        .set("2002",deepClone(genres))
        .set("2003",deepClone(genres))
        .set("2004",deepClone(genres))
        .set("2005",deepClone(genres))
        .set("2006",deepClone(genres))
        .set("2007",deepClone(genres))
        .set("2008",deepClone(genres))
        .set("2009",deepClone(genres))
        .set("2010",deepClone(genres))
        .set("2011",deepClone(genres))
        .set("2012",deepClone(genres))
        .set("2013",deepClone(genres))
        .set("2014",deepClone(genres))
        .set("2015",deepClone(genres))
        .set("2016",deepClone(genres))

    data.map((x)=>{
     const value = map.get(x.Year)
        value[x.Genre] += Number(x[label]);
     map.set(x.Year,value);
    })
    const keys = Array.from(map.keys());
    const formattedData = [];

    keys.map((year)=>{
        const values = map.get(year)
        formattedData.push({Year:year,...values})
    })

    return formattedData;
}