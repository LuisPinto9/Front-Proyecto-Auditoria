import React from 'react';
import Lateral from "../components/Lateral";
import NavBar from "../components/NavBar";
import Listar from "../components/academic_offer/Listar";

const ListFaculties = () => {
  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          <Listar />
        </div>
      </div>
    </div>
  )
}

export default ListFaculties;
