import React, { useEffect, useState } from 'react'
import Lateral from "../components/Lateral";
import NavBar from "../components/NavBar";
import Pagination from "../components/Pagination";

const ListTopic = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("https://back-simulacion-por-computador.vercel.app/topics")
          .then((res) => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            return res.json();
          })
          .then(
            (result) => {
              setData(result.data);
            }
          )
          .catch((error) => {
            console.log('Fetch error:', error);
          });
      }, []);
  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          <Pagination data={data}/>
        </div>
      </div>
    </div>
  )
}

export default ListTopic