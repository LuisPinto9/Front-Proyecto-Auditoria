import React, { useState, useEffect } from "react";
import axios from "axios";

const Table = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  const totalPages = Math.ceil(totalRecords / pageSize);
  const maxPagesToShow = 3;
  let startPage = Math.max(1, pageNumber - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(
    totalPages,
    pageNumber + Math.floor(maxPagesToShow / 2)
  );

  if (endPage - startPage < maxPagesToShow - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header py-3">
          <p className="text-primary m-0 fw-bold">Información de Estudiantes</p>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 text-nowrap">
              <div
                id="dataTable_length"
                className="dataTables_length"
                aria-controls="dataTable"
              >
                <label className="form-label">
                  Mostrar&nbsp;
                  <select
                    className="d-inline-block form-select form-select-sm"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  &nbsp;
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="text-md-end dataTables_filter"
                id="dataTable_filter"
              >
                <label className="form-label">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    aria-controls="dataTable"
                    placeholder="Buscar"
                  />
                </label>
              </div>
            </div>
          </div>
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
                    <th>#</th>
                    <th>Identificación</th>
                    <th onClick={() => handleSortChange("code")}>
                      <button className="btn btn-link p-0 m-0 d-flex align-items-center fw-bold text-decoration-none text-black">
                        Código
                        <i className="pi pi-sort-alt px-1"></i>
                      </button>
                    </th>
                    <th>Tipo de Documento</th>
                    <th onClick={() => handleSortChange("firstName")}>
                      <button className="btn btn-link p-0 m-0 d-flex align-items-center fw-bold text-decoration-none text-black">
                        Nombre
                        <i className="pi pi-sort-alt px-1"></i>
                      </button>
                    </th>
                    <th onClick={() => handleSortChange("lastName")}>
                      <button className="btn btn-link p-0 m-0 d-flex align-items-center fw-bold text-decoration-none text-black">
                        Apellido
                        <i className="pi pi-sort-alt px-1"></i>
                      </button>
                    </th>
                    <th>Fecha de Nacimiento</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
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
          <div className=" align-self-center">
            <p
              id="dataTable_info"
              className="dataTables_info"
              role="status"
              aria-live="polite"
            >
              Mostrando{" "}
              {Math.min((pageNumber - 1) * pageSize + 1, totalRecords)} -{" "}
              {Math.min(pageNumber * pageSize, totalRecords)} de {totalRecords}{" "}
              estudiantes
            </p>
          </div>
          <div className="d-flex justify-content-center mb-0">
            <div style={{ overflowX: "auto" }}>
              <nav className="d-flex justify-content-center justify-content-md-end dataTables_paginate paging_simple_numbers">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      pageNumber === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      aria-label="Previous"
                      onClick={() => handlePageChange(pageNumber - 1)}
                    >
                      <span aria-hidden="true">«</span>
                    </button>
                  </li>
                  {startPage > 1 && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </button>
                    </li>
                  )}
                  {startPage > 2 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {pages.map((page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        pageNumber === page ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  {endPage < totalPages - 1 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {endPage < totalPages && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  )}
                  <li
                    className={`page-item ${
                      pageNumber === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      aria-label="Next"
                      onClick={() => handlePageChange(pageNumber + 1)}
                    >
                      <span aria-hidden="true">»</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
