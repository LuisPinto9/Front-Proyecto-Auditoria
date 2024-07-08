import React, {useRef, useState, useEffect} from "react";
import Lateral from "../components/Lateral";
import NavBar from "../components/NavBar";
import { Toast } from "primereact/toast";
import axios from "axios";

function StudentInscription() {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/topics`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const findGroups = async (studentId) => {
    setGroups([]);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/inscriptions/findIsncriptionsByStudent/${studentId}`
      );

      const inscriptionsData = response.data.data;

      const groupsData = inscriptionsData.map((inscription) => ({
        _id: inscription.group._id,
        name: inscription.group.name,
        grupo: inscription.group.grupo,
        quotas: inscription.group.quotas,
      }));

      setGroups(groupsData);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Inscripciones no encontradas",
        detail: "El estudiante no tiene inscripciones registradas.",
        life: 3000,
      });
    }
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
                <p className="text-primary m-0 fw-bold">Materías disponibles</p>
              </div>
              <div className="card-body">
                <Toast ref={toast} />
                {/* <TableActionTools
                  pageSize={pageSize}
                  handlePageSizeChange={handlePageSizeChange}
                  findById={findByID}
                  fetchData={fetchData}
                  dataSize={data.length}
                  students={data}
                  resetData={resetData}
                /> */}

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
                          <th></th>
                          <th>Nombre</th>
                          <th>Aula</th>
                          <th>Creditos</th>
                          <th>Cupos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((topic) => (
                          <tr key={topic._id}>
                            <td>
                              <i
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#availableGroups"
                                aria-label="Ver grupos"
                                onClick={() =>
                                  findStudentInscriptions(student._id)
                                }
                                className="pi pi-angle-right btn"
                                style={{
                                  border: "none",
                                  padding: 0,
                                }}
                              ></i>
                            </td>
                            <td>{topic.name}</td>
                            <td>{topic.aula}</td>
                            <td>{topic.credits}</td>
                            <td>{topic.quotas}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* <ModalStudentInscriptions groups={groups} /> */}
                {/* <InfoPagination
                  totalRecords={totalRecords}
                  pageSize={pageSize}
                  pageNumber={pageNumber}
                  handlePageChange={handlePageChange}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentInscription;
