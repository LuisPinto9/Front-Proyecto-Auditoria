import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
const TableActionTools = ({
  pageSize,
  handlePageSizeChange,
  findById,
  fetchData,
  dataSize,
  students,
  resetData,
}) => {
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {
    searchCode ? null : dataSize !== 1 ? null : fetchData();
  }, [searchCode]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
    XLSX.writeFile(workbook, "estudiantes.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Información de Estudiantes", 20, 10);
    doc.autoTable({
      head: [
        [
          "Código",
          "Nombre",
          "Apellido",
          "Fecha de Nacimiento",
          "Teléfono",
          "Email",
          "Estado",
        ],
      ],
      body: students.map((student) => [
        student.code,
        student.firstName,
        student.lastName,
        new Date(student.birthdate).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }),
        student.cellphone,
        student.email,
        student.state,
      ]),
    });
    doc.save("estudiantes.pdf");
  };

  return (
    <>
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
            className="text-md-end align-items-center dataTables_filter"
            id="dataTable_filter"
          >
            <button
              className="btn"
              onClick={exportToExcel}
              style={{ border: "none" }}
            >
              <i
                className="pi pi-file-excel"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </button>
            <button
              className="btn"
              onClick={exportToPDF}
              style={{ border: "none" }}
            >
              <i className="pi pi-file-pdf" style={{ fontSize: "1.5rem" }}></i>
            </button>
            {/* <button
              className="btn"
              onClick={resetData}
              style={{ border: "none" }}
            >
              <i
                className="pi pi-filter-slash"
                style={{ fontSize: "1.3rem" }}
              ></i>
            </button> */}
            <button
              type="button"
              className="btn"
              onClick={() => findById(searchCode)}
              disabled={!searchCode}
              style={{
                padding: 0,
                height: "2rem",
                width: "2rem",
                border: "none",
              }}
            >
              <i
                className="pi pi-search px-1"
                style={{ fontSize: "1rem", color: "black" }}
              ></i>
            </button>
            <label className="form-label">
              <input
                type="search"
                className="form-control form-control-sm"
                aria-controls="dataTable"
                placeholder="Buscar por el código"
                onKeyUp={(e) =>
                  e.key === "Enter" ? findById(searchCode) : null
                }
                value={searchCode}
                onChange={(e) => {
                  /^\d*$/.test(e.target.value)
                    ? setSearchCode(e.target.value)
                    : null;
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableActionTools;
