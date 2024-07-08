import React, { useRef, useState, useEffect } from "react";
import Lateral from "../components/Lateral";
import NavBar from "../components/NavBar";
import { Toast } from "primereact/toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function TopicInscription() {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("authToken"))[0];
  const decodedToken = token ? jwtDecode(token) : null;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      if (token) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/inscriptions/buscarIncritos/${decodedToken.objectId}`
        );
        setGroups(response.data.data);
        
      }
      console.log(decodedToken.objectId)
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener los grupos.",
        life: 3000,
      });
    }
    setIsLoading(false);
  };


  const deleteInscription = async (inscriptionId) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/inscriptions/${inscriptionId}`
      );
      toast.current.show({
        severity: "success",
        summary: "Eliminada",
        detail: "La inscripción ha sido eliminada correctamente.",
        life: 3000,
      });
      fetchTopics(); // Actualizar la lista de temas después de la eliminación
    } catch (error) {
      console.error("Error deleting inscription:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la inscripción.",
        life: 3000,
      });
    }
    setIsLoading(false);
  };

  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          <div className="container-fluid">
            <div className="card shadow">
              <div className="card-header py-3">
                <p className="text-primary m-0 fw-bold">Grupos Inscritos</p>
              </div>
              <div className="card-body">
                <Toast ref={toast} />
                <div
                  className="table-responsive table mt-2"
                  id="dataTable"
                  role="grid"
                  aria-describedby="dataTable_info"
                >
                  {isLoading && (
                    <div className="loading-overlay">
                      <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: "2rem" }}
                      ></i>
                    </div>
                  )}
                  {!isLoading && groups.length === 0 && (
                    <div className="no-data-message">
                      No hay grupos inscritos...
                    </div>
                  )}
                  {!isLoading && groups.length > 0 && (
                    <div
                      className="table-responsive table mt-2"
                      id="dataTable"
                      role="grid"
                      aria-describedby="dataTable_info"
                      style={{ maxHeight: "calc(100vh - 380px)" }}
                    >
                      <table className="table my-0 text-center" id="dataTable">
                        <thead>
                          <tr>
                          <th>Materia</th>
                            <th>Aula</th>
                            <th>Créditos</th>
                            <th>Estado</th>
                            <th>Cupos</th>
                            <th>Grupo</th>
                            <th>Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groups.map((topic) => (
                            <tr key={topic._id}>
                              <td>{topic.name}</td>
                              <td>{topic.aula}</td>
                              <td>{topic.credits}</td>
                              <td>{topic.state}</td>
                              <td>{topic.quotas}</td>
                              <td>{topic.grupo}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => deleteInscription(topic.inscriptionId)}
                                >
                                  Eliminar
                                </button>
                              </td>
                              
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicInscription;
