import React from 'react'
import Lateral from "../components/Lateral"
import NavBar from "../components/NavBar";
import UserInformation from '../components/dataUser/UserInformation';

const DataUser = () => {
  return (
    <div id="page-top">
    <div id="wrapper">
      <Lateral />
      <div className="d-flex flex-column" id="content-wrapper">
        <NavBar />
        <UserInformation/>
      </div>
    </div>
  </div>
  )
}

export default DataUser