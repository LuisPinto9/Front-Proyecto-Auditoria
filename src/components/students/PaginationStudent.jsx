import React from "react";
import PropTypes from 'prop-types';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const PaginationStudent = ({ data }) => {
  // const columas = data.length > 0 ? Object.keys(data[0]) : [];
  const columns = [
    { field: "id", header: "ID" },
    { field: "identification", header: "identificacion" },
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
    <div className="card p-4 m-4">
      <DataTable
        value={data}
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
    </div>
  );
};

// Validación de props usando prop-types
PaginationStudent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default PaginationStudent;
