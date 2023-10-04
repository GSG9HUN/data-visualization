import {useRef} from "react";

export function TopSoldVideoGames({year}){
    const ref = useRef()

    if(!year){
        console.log("not year")
        return
    }
    console.log("year => ",year)
    return <svg ref={ref}></svg>
}