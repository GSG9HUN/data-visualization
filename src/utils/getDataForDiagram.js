export function getDataForDiagram(data, year = "", type = "") {
    if (year === "----" && type === "----") {
        return data
    }
    let dataForHistogram;
    if (type !== "----") {
        dataForHistogram = data.map((data) => {
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
        dataForHistogram = dataForHistogram ? dataForHistogram.filter((x => x.Year === year)) : data.filter((x => x.Year === year));
    }

    return dataForHistogram;
}
