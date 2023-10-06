export default function formatData (responseData) {
    const rows = responseData.split("\r\n");
    const columns = getColumns(rows[0]);
    const formattedData = [];
    const yearList = new Set()
    for(let i=1; i<rows.length-1;i++){
        const row = rows[i].split(",");
        if(row.length > 11 && isNaN(Number(row[3]))){
            let k =1;
            let name = "";
            while (!row[k].endsWith('"')){
                name+=row[k]
                k++;
            }
            const formattedObject = {
                Rank: Number(row[0]),
                Name:name,
                Platform:row[k+1],
                Year:row[k+2],
                Genre:row[k+3],
                Publisher:row[k+4],
                NA_Sales:row[k+5],
                EU_Sales:row[k+6],
                JP_Sales:row[k+7],
                Other_Sales:row[k+8],
                Global_Sales:row[k+9]
            }
            yearList.add(formattedObject.Year)
            formattedData.push(formattedObject)
            continue;
        }
        if(row.length > 11 && row[5].includes('"')){
            let k =5;
            let publisher = "";
            while (!row[k].endsWith('"')){
                publisher+=row[k]
                k++;
            }
            const formattedObject = {
                Rank: Number(row[0]),
                Name:row[1],
                Platform:row[2],
                Year:row[3],
                Genre:row[4],
                Publisher:publisher,
                NA_Sales:row[k+1],
                EU_Sales:row[k+2],
                JP_Sales:row[k+3],
                Other_Sales:row[k+4],
                Global_Sales:row[k+5]
            }
            yearList.add(formattedObject.Year)
            formattedData.push(formattedObject)
            continue;
        }
        const formattedObject = {
            Rank: Number(row[0]),
            Name:row[1],
            Platform:row[2],
            Year:row[3],
            Genre:row[4],
            Publisher:row[5],
            NA_Sales:row[6],
            EU_Sales:row[7],
            JP_Sales:row[8],
            Other_Sales:row[9],
            Global_Sales:row[10]
        }
        yearList.add(formattedObject.Year)
        formattedData.push(formattedObject)
    }
    return [formattedData,Array.from(yearList),columns];
}

function getColumns(firstRow) {
    const columnNames =  firstRow.split(",");
    const columns = [];
    for(let i=0; i< columnNames.length;i++){
        columns.push({
            field: columnNames[i], headerName: columnNames[i],
        })
    }
    return columns;
}
