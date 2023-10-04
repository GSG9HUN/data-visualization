import logo from './logo.svg';
import './App.css';
import d3 from "d3";
import {useEffect, useRef} from "react";
function App() {

  const Circle = () =>{
    const ref = useRef();

    useEffect(()=>{
      const svgElement = d3.select(ref.current)
      svgElement.append("circle").attr("cx",150).attr("cy",70).attr("r",50)
    },[])

    return <svg ref={ref}>
    </svg>
  }

  return (
   <Circle/>
  );
}

export default App;
