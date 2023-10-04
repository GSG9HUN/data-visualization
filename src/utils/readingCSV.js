const responseData = await readingCSV("vgsales.csv")
async function readingCSV(fileName){
    const response = await fetch("../../dataset/"+fileName)
    return await response.text()
}

export default responseData;