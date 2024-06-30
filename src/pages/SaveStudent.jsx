import React from 'react'
import Lateral from "../components/Lateral"
import NavBar from "../components/NavBar";
import CreateStudent from '../components/students/CreateStudent';

const SaveStudent = () => {
  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          <CreateStudent/>
        </div>
      </div>
    </div>
  )
}

export default SaveStudent