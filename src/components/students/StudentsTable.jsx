import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InfoPagination from "./InfoStudentsPagination";
import TableActionTools from "./TableActionTools";
import { Toast } from "primereact/toast";

const Table = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    fetchTotalCount();
    fetchData();
  }, [pageSize, pageNumber, sortBy, sortDirection]);

  const fetchTotalCount = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://back-simulacion-por-computador.vercel.app/students/countStudents"
      );
      setTotalRecords(response.data.countStudents);
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
    setIsLoading(false);
  };

  const findByID = async (searchId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://back-simulacion-por-computador.vercel.app/students/buscarId/${searchId}`
      );
      setData(response.data.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Estudiante no encontrado",
        detail: "El ID proporcionado no existe.",
        life: 3000,
      });
    }
    setIsLoading(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://back-simulacion-por-computador.vercel.app/students`,
        {
          params: {
            PageSize: pageSize,
            PageNumber: pageNumber,
            SortBy: sortBy,
            SortDirection: sortDirection,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1);
  };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleSortChange = (field) => {
    const newSortDirection =
      sortBy === field && sortDirection === "Asc" ? "Desc" : "Asc";
    setSortBy(field);
    setSortDirection(newSortDirection);
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header py-3">
          <p className="text-primary m-0 fw-bold">Información de Estudiantes</p>
        </div>
        <div className="card-body">
          <Toast ref={toast} />
          <TableActionTools
            pageSize={pageSize}
            handlePageSizeChange={handlePageSizeChange}
            findById={findByID}
            fetchData={fetchData}
            dataSize={data.length}
          />
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
                    <th>ID</th>
                    <th>Identificación</th>
                    <th onClick={() => handleSortChange("code")}>
                      <button className="btn btn-link p-0 m-0 d-flex align-items-center fw-bold text-decoration-none text-black">
                        Código
                        <i
                          className={`pi pi-sort-${
                            sortDirection === "Asc" && sortBy == "code"
                              ? "alpha-down"
                              : sortDirection === "Desc" && sortBy == "code"
                              ? "alpha-down-alt"
                              : "alt"
                          } px-1`}
                        ></i>
                      </button>
                    </th>
                    <th>Tipo de Documento</th>
                    <th onClick={() => handleSortChange("firstName")}>
                      <button className="btn btn-link p-0 m-0 d-flex align-items-center fw-bold text-decoration-none text-black">
                        Nombre
                        <i
                          className={`pi pi-sort-${
                            sortDirection === "Asc" && sortBy == "firstName"
                              ? "alpha-down"
                              : sortDirection === "Desc" &&
                                sortBy == "firstName"
                              ? "alpha-down-alt"
                              : "alt"
                          } px-1`}
                        ></i>
                      </button>
                    </th>
                    <th onClick={() => handleSortChange("lastName")}>
                      <button className="btn btn-link p-0 m-0 d-flex align-items-center fw-bold text-decoration-none text-black">
                        Apellido
                        <i
                          className={`pi pi-sort-${
                            sortDirection === "Asc" && sortBy == "lastName"
                              ? "alpha-down"
                              : sortDirection === "Desc" && sortBy == "lastName"
                              ? "alpha-down-alt"
                              : "alt"
                          } px-1`}
                        ></i>
                      </button>
                    </th>
                    <th>Fecha de Nacimiento</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((student) => (
                    <tr key={student._id}>
                      <td>{student.id}</td>
                      <td>{student.Identification}</td>
                      <td>{student.code}</td>
                      <td>{student.documentType}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>
                        {new Date(student.birthdate).toLocaleDateString(
                          "es-ES",
                          { day: "numeric", month: "numeric", year: "numeric" }
                        )}
                      </td>
                      <td>{student.cellphone}</td>
                      <td>{student.email}</td>
                      <td>{student.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <InfoPagination
            totalRecords={totalRecords}
            pageSize={pageSize}
            pageNumber={pageNumber}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
