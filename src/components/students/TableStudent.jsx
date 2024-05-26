


import React, { useEffect, useState } from 'react'
// import TableStudent from '../components/students/TableStudent'
import Lateral from "../Lateral";
import NavBar from "../NavBar";
import PaginationStudent from "./PaginationStudent";

const TableStudent = () => {
        const [data, setData] = useState([]);
        useEffect(() => {
            fetch("https://back-simulacion-por-computador.vercel.app/students")
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
              <PaginationStudent data={data}/>
            </div>
          </div>
        </div>
      )
    }

export default TableStudent

