import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar shadow mb-4 topbar static-top bg-primary d-flex justify-content-between">
      <div className="container-fluid">
        <div className="flex-grow-1"></div>{" "}
        {/* Este div actúa como relleno para empujar el botón hacia la derecha */}
        <div className="d-flex">
          <Link
            to="/"
            className="btn btn-outline-light"
            style={{ textDecoration: "none" }}
          >
            <span>Salir</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
