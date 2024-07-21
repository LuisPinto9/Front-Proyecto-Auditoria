import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { ProgressSpinner } from 'primereact/progressspinner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Listar = () => {
  const [faculties, setFaculties] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [programs, setPrograms] = useState({});
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = () => {
    fetch(`${import.meta.env.VITE_API_URL}/faculties`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        setFaculties(result.data);
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };

  const fetchProgramsByFaculty = (facultyId) => {
    fetch(`${import.meta.env.VITE_API_URL}/faculties/${facultyId}/programs`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        setPrograms((prevPrograms) => ({
          ...prevPrograms,
          [facultyId]: result.data,
        }));
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(faculties);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facultades");
    XLSX.writeFile(workbook, "facultades.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Tabla Facultades", 20, 10);
    doc.autoTable({
      head: [['Nombre', 'Ubicación', 'Teléfono', 'Email']],
      body: faculties.map(faculty => [
        faculty.name,
        faculty.ubication,
        faculty.phone,
        faculty.email
      ]),
    });
    doc.save('facultades.pdf');
  };

  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Programas Desplegados",
      detail: event.data.name,
      life: 3000,
    });
    fetchProgramsByFaculty(event.data._id);
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Programas Cerrados",
      detail: event.data.name,
      life: 3000,
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const rowExpansionTemplate = (data) => {
    const programsData = programs[data._id] || [];
    return (
      <div className="p-3">
        <h5>Programas de la Facultad {data.name}</h5>
        {programsData.length > 0 ? (
          <DataTable value={programsData}>
            <Column field="level" header="Nivel" />
            <Column field="name" header="Nombre" />
            <Column field="snies_code" header="Código SNIES" />
            <Column field="location" header="Ubicación" />
            <Column field="modality" header="Modalidad" />
          </DataTable>
        ) : (
          <p>No hay programas disponibles</p>
        )}
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h3>Tabla Facultades</h3>
      <div>
        <button className="btn" onClick={exportToExcel} style={{border:"none"}}>
          <i className="pi pi-file-excel" style={{fontSize:"2rem"}}></i>
        </button>
        <button className="btn" onClick={exportToPDF} style={{border:"none"}}>
          <i className="pi pi-file-pdf" style={{fontSize:"2rem"}}></i>
        </button>
      </div>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Palabra de búsqueda" />
      </IconField>
    </div>
  );

  return (
    <div className="card p-4 m-4">
      <Toast ref={toast} />
      <DataTable
        filters={filters}
        filterDisplay="row"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        value={faculties}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="_id"
        header={header}
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column expander={true} style={{ width: "5rem" }} />
        <Column field="name" header="Nombre" sortable />
        <Column field="ubication" header="Ubicación" sortable />
        <Column field="phone" header="Teléfono" sortable />
        <Column field="email" header="Email" sortable />
      </DataTable>
    </div>
  );
};

export default Listar;
