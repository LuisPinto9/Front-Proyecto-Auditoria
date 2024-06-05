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


import { Button } from 'primereact/button';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const PaginationTopics = ({ data, loading }) => {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [groups, setGroups] = useState({});
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    aula: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    date_registration: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    setProducts(data);
  }, [data]);

  const callGroupsTopics = (rowData) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/topics/groups/${rowData._id}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        setGroups((prevGroups) => ({
          ...prevGroups,
          [rowData._id]: result.data,
        }));
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };
  //mensage cuando se expande
  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Grupos Desplegados",
      detail: event.data.name,
      life: 3000,
    });
    callGroupsTopics(event.data);
  };
  //mensage cuando se colapsa
  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Grupos Cerrados",
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




  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "table_data.xlsx");
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Tabla Materias", 20, 10);
    doc.autoTable({
      head: [['Name', 'Aula', 'Creditos', 'Fecha Registro', 'Cupos']],
      body: products.map(product => [
        product.name,
        product.aula,
        product.credits,
        product.date_registration,
        product.quotas
      ]),
    });
    doc.save('table_data.pdf');
  };





  const rowExpansionTemplate = (data) => {
    const groupsData = groups[data._id] || [];
    return (
      <div className="p-3">
        <h5>Grupos de {data.name}</h5>
        {groupsData.length > 0 ? (
          <DataTable value={groupsData}>
            <Column field="name" header="Nombre" />
            <Column field="grupo" header="Grupo" />
            <Column field="quotas" header="Cupos" />
          </DataTable>
        ) : (
          <p>No hay grupos disponibles</p>
        )}
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
    <h3>Tabla Materias</h3>


    <div>
      <button className="btn" onClick={exportToExcel} style={{border:"none"}}><i className="pi pi-file-excel" style={{fontSize:"2rem"}}></i></button>
      <button className="btn" onClick={exportToPDF} style={{border:"none"}}><i className="pi pi-file-pdf" style={{fontSize:"2rem"}}></i></button>
    
      </div>


    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Palabra de busqueda" />
    </IconField>
  </div>
  );

  return (
    <div className="card p-4 m-4">
      <Toast ref={toast} />
      {loading ? (
        <ProgressSpinner mode="indeterminate" style={{width: '50px', height: '50px'}} strokeWidth="5" fill="var(--surface-ground)" animationDuration=".5s"/>
      ) : (
        <DataTable
        filters={filters}
        filterDisplay="row"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        value={products}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column expander={true} style={{ width: "5rem" }} />
        <Column field="name" header="Name" sortable />
        <Column field="aula" header="Aula" sortable />
        <Column field="credits" header="Creditos" sortable />
        <Column field="date_registration" header="Fecha Registro" sortable />
        <Column field="quotas" header="Cupos" sortable />
      </DataTable>
      )}


      
    </div>
  );
};

PaginationTopics.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PaginationTopics;
