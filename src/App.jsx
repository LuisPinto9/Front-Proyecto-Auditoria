import React from "react";
import Lateral from "./components/Lateral";
import Table from "./components/Table";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          <Table />
        </div>
      </div>
    </div>
  );
}

export default App;
