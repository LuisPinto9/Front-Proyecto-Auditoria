import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Lateral = () => {
  const token = JSON.parse(localStorage.getItem("authToken"))[0];
  const decodedToken = token ? jwtDecode(token) : null;
  const isAdmin = decodedToken && decodedToken.role === "admin";

  return (
    <nav className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark">
      <div className="container-fluid d-flex flex-column justify-content-start align-items-start p-0 ms-2 me-2">
        <button className="my-custom-button navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3 text">
            <Link
              to="/"
              className="text-white"
              style={{ textDecoration: "none" }}
            >
              <span>Universidad</span>
            </Link>
          </div>
        </button>

        {!isAdmin && (
          <div>
            <div className="margin-right-38">
              <Link
                to="/userInformation"
                className="btn btn-primary my-custom-button text-white"
                style={{ textDecoration: "none" }}
              >
                <i className="pi pi-user icon"></i>&nbsp;
                <span className="text">Información</span>
              </Link>
            </div>

            <div className="margin-right-38">
              <Link
                to="/studentInscription"
                className="btn btn-primary my-custom-button text-white"
                style={{ textDecoration: "none" }}
              >
                <i className="pi pi-search-plus icon"></i>&nbsp;
                <span className="text">Inscribir Materias</span>
              </Link>
            </div>

            <div className="margin-right-38">
              <Link
                to="/TopicInscription"
                className="btn btn-primary my-custom-button text-white"
                style={{ textDecoration: "none" }}
              >
                <i className="pi pi-book icon"></i>&nbsp;
                <span className="text">Materias Inscritas</span>
              </Link>
            </div>
          </div>
        )}

        {isAdmin && (
          <div>
            <div className="margin-right-38">
              <Link
                to="/userInformation"
                className="btn btn-primary my-custom-button text-white"
                style={{ textDecoration: "none" }}
              >
                <i className="pi pi-user icon"></i>&nbsp;
                <span className="text">Información</span>
              </Link>
            </div>
            <div className="margin-right-38">
              <button
                className="my-custom-button btn btn-primary"
                data-bs-toggle="collapse"
                href="#collapse-1"
              >
                <i className="far fa-user icon"></i>&nbsp;
                <span className="text">Estudiantes</span>
              </button>
              <div className="collapse ms-4" id="collapse-1">
                <div>
                  <button className="my-custom-button text-white">
                    <Link
                      to="/listStudents"
                      className="text-white"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="pi pi-list icon"></i>&nbsp;
                      <span className="text">Listar</span>
                    </Link>
                  </button>
                </div>

                <div>
                  <button className="my-custom-button text-white">
                    <Link
                      to="/saveStudent"
                      className="text-white"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="pi pi-save icon"></i>&nbsp;
                      <span className="text">Guardar</span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>
            <div className="margin-right-38">
              <button
                className="my-custom-button btn btn-primary"
                data-bs-toggle="collapse"
                href="#collapse-2"
              >
                <i className="far fa-file-alt icon"></i>&nbsp;
                <span className="text">Materias</span>
              </button>
              <div className="collapse ms-4" id="collapse-2">
                <div>
                  <button className="my-custom-button text-white">
                    <Link
                      to="/listTopic"
                      className="text-white"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="pi pi-list icon"></i>&nbsp;
                      <span className="text">Listar</span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>
            <div className="margin-right-38">
              <button
                className="my-custom-button btn btn-primary"
                data-bs-toggle="collapse"
                href="#collapse-3"
              >
                <i className="far fa-address-book icon"></i>&nbsp;
                <span className="text">Grupos</span>
              </button>
              <div className="collapse ms-4" id="collapse-3">
                <div>
                  <button className="my-custom-button text-white">
                    <Link
                      to="/listGroups"
                      className="text-white"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="pi pi-list icon"></i>&nbsp;
                      <span className="text">Listar</span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>
            <div className="margin-right-38">
              <button
                className="my-custom-button btn btn-primary"
                data-bs-toggle="collapse"
                href="#collapse-4"
              >
                <i className="far fa-address-book icon"></i>&nbsp;
                <span className="text">Facultades</span>
              </button>
              <div className="collapse ms-4" id="collapse-4">
                <div>
                  <button className="my-custom-button text-white">
                    <Link
                      to="/listFaculties"
                      className="text-white"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="pi pi-list icon"></i>&nbsp;
                      <span className="text">Listar</span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Lateral;
