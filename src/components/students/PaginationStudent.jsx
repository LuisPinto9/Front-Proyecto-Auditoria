

import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";


const PaginationStudent = ({ data }) => {
  // const columas = data.length > 0 ? Object.keys(data[0]) : [];

  const [filteredData, setFilteredData] = useState(data);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchValue) {
      const filtered = data.filter(student => 
        student.id.toString().includes(searchValue) || 
        student.Identification.toString().includes(searchValue) ||
        student.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchValue, data]);


  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Barra de filtro</h5>
      <span className="p-input-icon-left">      
        <InputText 
          type="search" 
          onInput={(e) => setSearchValue(e.target.value)} 
          placeholder="buscar id, nombre, identificacion" 
          style={{ width: '600px' }}
        />
        <i className="pi pi-search" />
        <i className="pi pi-search" />
       </span>
    </div>
  );

  const columns = [
    { field: "id", header: "ID" },
    { field: "Identification", header: "identificacion" },
    { field: "code", header: "codigo" },
    { field: "documentType", header: "tipo" },
    { field: "firstName", header: "nombre" },
    { field: "lastName", header: "apellido" },
    { field: "birthdate", header: "cumpleaños" },
    { field: "cellphone", header: "Teléfono" },
    { field: "email", header: "Email" },
    { field: "state", header: "estado" },

    
  ];
  return (
      <Card title={header} style={{ margin: "15px" }}>
        <DataTable
          value={filteredData}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
        >
          {columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} sortable />
          ))}
         
        </DataTable>
      </Card>
    );
};

PaginationStudent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default PaginationStudent;
