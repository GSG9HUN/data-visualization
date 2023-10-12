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