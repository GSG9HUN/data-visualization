export default function formatData (responseData) {
    const rows = responseData.split("\r\n");
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
                rank: row[0],
                name:name,
                platform:row[k+1],
                year:row[k+2],
                genre:row[k+3],
                publisher:row[k+4],
                na_sales:row[k+5],
                eu_sales:row[k+6],
                jp_sales:row[k+7],
                other_sales:row[k+8],
                global_sales:row[k+9]
            }
            yearList.add(formattedObject.year)
            formattedData.push(formattedObject)
            continue;
        }
        const formattedObject = {
            rank: row[0],
            name:row[1],
            platform:row[2],
            year:row[3],
            genre:row[4],
            publisher:row[5],
            na_sales:row[6],
            eu_sales:row[7],
            jp_sales:row[8],
            other_sales:row[9],
            global_sales:row[10]
        }
        yearList.add(formattedObject.year)
        formattedData.push(formattedObject)
    }
    return [formattedData,Array.from(yearList)];
}