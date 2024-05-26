import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";


const PaginationInscription = ({ data }) => {

  const [filteredData, setFilteredData] = useState(data);
  const [searchValue, setSearchValue] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    if (searchValue) {
      const filtered = data.filter(item => 
        item._id.includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchValue, data]);

  const toggleExpansion = (rowData, type) => {
    setExpandedRows(prevState => ({
      ...prevState,
      [rowData._id]: {
        ...prevState[rowData._id],
        [type]: !prevState[rowData._id]?.[type]
      }
    }));
  };


  const renderStudentDetails = (rowData) => {
    if (!expandedRows[rowData._id]?.student) return null;
    return (
      <div style={{ marginLeft: '2rem' }}>
        <DataTable value={[rowData.student]} header="Detalles del Estudiante" style={{ marginBottom: '1rem' }}>
          <Column field="id" header="ID" />
          <Column field="Identification" header="Identificación" />
          <Column field="code" header="Código" />
          <Column field="documentType" header="Tipo de Documento" />
          <Column field="firstName" header="Nombre" />
          <Column field="lastName" header="Apellido" />
          <Column field="birthdate" header="Cumpleaños" body={rowData => new Date(rowData.birthdate).toLocaleDateString()} />
          <Column field="cellphone" header="Teléfono" />
          <Column field="email" header="Email" />
          <Column field="state" header="Estado" />
        </DataTable>
      </div>
    );
  };

  const renderGroupDetails = (rowData) => {
    if (!expandedRows[rowData._id]?.group) return null;
    return (
      <div style={{ marginLeft: '2rem' }}>
        <DataTable value={[rowData.group]} header="Detalles del Grupo" style={{ marginBottom: '1rem' }}>
          <Column field="name" header="Nombre del Grupo" />
          <Column field="grupo" header="Grupo" />
          <Column field="topic" header="Tema" />
          <Column field="quotas" header="Cuotas" />
        </DataTable>
      </div>
    );
  };



const header = (
    <div className="table-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h5 className="p-m-0">Barra de Busqueda
      <p></p>
      <span className="p-input-icon-left">
        
        <InputText 
          type="search" 
          onInput={(e) => setSearchValue(e.target.value)} 
          placeholder="Buscar por ID o estado"
          style={{ width: '500px', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc' }}
        />
        <i className="pi pi-search" />
      </span>
      </h5>
    </div>
  );


  return (
    <Card title={header} style={{ margin: "15px" }}>
      <DataTable
        value={filteredData}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        dataKey="_id"
      >
        <Column field="_id" header="ID" />
        <Column field="registrationDate" header="Fecha de Registro" body={rowData => new Date(rowData.registrationDate).toLocaleDateString()} />
        <Column field="status" header="Estado" />
        <Column 
          header="Detalles del Estudiante"
          body={rowData => (
            <Button
              label={expandedRows[rowData._id]?.student ? "Ocultar" : "Mostrar"}
              onClick={() => toggleExpansion(rowData, 'student')}
            />
          )}
        />
        <Column 
          header="Detalles del Grupo"
          body={rowData => (
            <Button
              label={expandedRows[rowData._id]?.group ? "Ocultar" : "Mostrar"}
              onClick={() => toggleExpansion(rowData, 'group')}
            />
          )}
        />
      </DataTable>
      {filteredData.map(rowData => (
        <React.Fragment key={rowData._id}>
          {renderStudentDetails(rowData)}
          {renderGroupDetails(rowData)}
        </React.Fragment>
      ))}
    </Card>
  );
};

PaginationInscription.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default PaginationInscription;
