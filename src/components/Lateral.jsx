import React from "react";
import { Link } from "react-router-dom";

const Lateral = () => {
  return (
    <nav className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark">
      <div className="container-fluid d-flex flex-column justify-content-start align-items-start p-0 ms-2 me-2">
        <button
          className="my-custom-button navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          onClick={() => {
            // eslint-disable-next-line no-restricted-globals
          }}
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">
            <Link
              to="/"
              className="text-white"
              style={{ textDecoration: "none" }}
            >
              <span>Universidad</span>
            </Link>
          </div>
        </button>

        <div>
          {/* Inicio colapse */}
          <div className="margin-right-38">
            <button
              className="my-custom-button btn btn-primary"
              data-bs-toggle="collapse"
              href="#collapse-1"
            >
              <i className="far fa-user"></i>&nbsp; Estudiantes
            </button>
            <div className="collapse ms-4" id="collapse-1">
              <div>
                <button className="my-custom-button text-white">
                  <Link
                    to="/listStudents"
                    className="text-white"
                    style={{ textDecoration: "none" }}
                  >
                    <i className="pi pi-list"></i> Listar
                  </Link>
                </button>
              </div>
            </div>
          </div>
          {/* Inicio colapse */}
          <div className="margin-right-38">
            <button
              className="my-custom-button btn btn-primary"
              data-bs-toggle="collapse"
              href="#collapse-2"
            >
              <i className="far fa-file-alt"></i>&nbsp; Materias
            </button>
            <div className="collapse ms-4" id="collapse-2">
              <div>
                <button className="my-custom-button text-white">
                  <Link
                    to="/listTopic"
                    className="text-white"
                    style={{ textDecoration: "none" }}
                  >
                    <i className="pi pi-list"></i> Listar
                  </Link>
                </button>
              </div>
            </div>
          </div>
          {/* Inicio colapse */}
          <div className="margin-right-38">
            <button
              className="my-custom-button btn btn-primary"
              data-bs-toggle="collapse"
              href="#collapse-3"
            >
              <i className="far fa-address-book"></i>&nbsp; Grupos
            </button>
            <div className="collapse ms-4" id="collapse-3">
              <div>
                <button className="my-custom-button text-white">
                  <Link
                    to="/listGroups"
                    className="text-white"
                    style={{ textDecoration: "none" }}
                  >
                    <i className="pi pi-list"></i> Listar
                  </Link>
                </button>
              </div>
            </div>
          </div>
          {/* <div className="margin-right-38">
            <Link
              className="my-custom-button btn btn-primary"
              to="/listInscription"
            >
              <i className="far fa-user"></i>&nbsp; Inscripciones
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Lateral;
