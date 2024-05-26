import React, { useState, useEffect } from "react";

const TableActionTools = ({
  pageSize,
  handlePageSizeChange,
  findById,
  fetchData,
  dataSize,
}) => {
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {
    searchCode ? null : dataSize !== 1 ? null : fetchData();
  }, [searchCode]);

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
                placeholder="Buscar por ID"
                onKeyUp={(e) => (e.key === "Enter" ? findById(searchCode) : null)}
                value={searchCode}
                onChange={(e) => {
                  setSearchCode(e.target.value);
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
