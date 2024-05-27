import React, { useState } from "react";
import PropTypes from 'prop-types';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

const Pagination = ({ data }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    grupo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    quotas: { value: null, matchMode: FilterMatchMode.EQUALS } // Agregamos el filtro para "quotas"
  });

  const colums = data.length > 0 ? Object.keys(data[0]) : [];

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // Si el campo de búsqueda está vacío, restablecemos el filtro global
    if (value === "") {
      _filters["global"].value = null;
      _filters["quotas"].value = null;
    } else {
      _filters["global"].value = value;
      _filters["quotas"].value = !isNaN(value) ? parseInt(value) : null;
    }

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h3>Tabla Grupos</h3>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Palabra de busqueda"
        />
      </IconField>
    </div>
  );

  return (
    <div className="card p-4 m-4">
      <DataTable
        header={header}
        value={data}
        filters={filters}
        filterDisplay="row"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
      >
        {colums.map((col) => (
          <Column key={col} sortable field={col} header={col} />
        ))}
      </DataTable>
    </div>
  );
};

// Validación de props usando prop-types
Pagination.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Pagination;