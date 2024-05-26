import React from "react";
import PropTypes from 'prop-types';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Pagination = ({ data }) => {
  const colums = data.length > 0 ? Object.keys(data[0]) : [];
  return (
    <div className="card p-4 m-4">
      <DataTable
        value={data}
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
