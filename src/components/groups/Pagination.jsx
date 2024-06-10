import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
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


const PaginationGroups = ({ data, loading }) => {
  const [groups, setGroups] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [students, setStudents] = useState({});
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    grupo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    topic: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    setGroups(data);
  }, [data]);

  const callStudentsByGroup = (rowData) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/inscriptions/ByGroup?groupId=${rowData._id}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        setStudents((prevStudents) => ({
          ...prevStudents,
          [rowData._id]: result.data,
        }));
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(groups);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grupos");
    XLSX.writeFile(workbook, "grupos.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Tabla Grupos", 20, 10);
    doc.autoTable({
      head: [['Nombre', 'Grupo', 'Cupos']],
      body: groups.map(group => [
        group.name,
        group.grupo,
        group.quotas
      ]),
    });
    doc.save('grupos.pdf');
  };
  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Estudiantes Desplegados",
      detail: event.data.name,
      life: 3000,
    });
    callStudentsByGroup(event.data);
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Estudiantes Cerrados",
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
    const studentsData = students[data._id] || [];
    return (
      <div className="p-3">
        <h5>Estudiantes del Grupo {data.name}</h5>
        {studentsData.length > 0 ? (
          <DataTable value={studentsData}>
            <Column field="code" header="Código" />
            <Column field="firstName" header="Nombre" />
            <Column field="lastName" header="Apellido" />
            <Column field="birthdate" header="Fecha de Nacimiento" />
            <Column field="cellphone" header="Celular" />
            <Column field="email" header="Email" />
          </DataTable>
        ) : (
          <p>No hay estudiantes disponibles</p>
        )}
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h3>Tabla Grupos</h3>
      <div>
      <button className="btn" onClick={exportToExcel} style={{border:"none"}}><i className="pi pi-file-excel" style={{fontSize:"2rem"}}></i></button>
      <button className="btn" onClick={exportToPDF} style={{border:"none"}}><i className="pi pi-file-pdf" style={{fontSize:"2rem"}}></i></button>
    
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
      {loading ? (
        <ProgressSpinner mode="indeterminate" style={{ width: '50px', height: '50px' }} strokeWidth="5" fill="var(--surface-ground)" animationDuration=".5s" />
      ) : (
        <DataTable
          filters={filters}
          filterDisplay="row"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          value={groups}
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
          <Column field="grupo" header="Grupo" sortable />
          <Column field="quotas" header="Cupos" sortable />
        </DataTable>
      )}
    </div>
  );
};

PaginationGroups.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PaginationGroups;
