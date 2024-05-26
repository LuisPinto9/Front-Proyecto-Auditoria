import React from "react";

const InfoPagination = ({
  totalRecords,
  pageSize,
  pageNumber,
  handlePageChange,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const maxPagesToShow = 3;
  let startPage = Math.max(1, pageNumber - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(
    totalPages,
    pageNumber + Math.floor(maxPagesToShow / 2)
  );

  if (endPage - startPage < maxPagesToShow - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return (
    <>
      <div className=" align-self-center">
        <p
          id="dataTable_info"
          className="dataTables_info"
          role="status"
          aria-live="polite"
        >
          Mostrando {Math.min((pageNumber - 1) * pageSize + 1, totalRecords)} -{" "}
          {Math.min(pageNumber * pageSize, totalRecords)} de {totalRecords}{" "}
          estudiantes
        </p>
      </div>
      <div className="d-flex justify-content-center mb-0">
        <div style={{ overflowX: "auto" }}>
          <nav className="d-flex justify-content-center justify-content-md-end dataTables_paginate paging_simple_numbers">
            <ul className="pagination">
              <li className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  aria-label="Previous"
                  onClick={() => handlePageChange(pageNumber - 1)}
                >
                  <span aria-hidden="true">«</span>
                </button>
              </li>
              {startPage > 1 && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                </li>
              )}
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              {pages.map((page) => (
                <li
                  key={page}
                  className={`page-item ${pageNumber === page ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              {endPage < totalPages && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </li>
              )}
              <li
                className={`page-item ${
                  pageNumber === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  aria-label="Next"
                  onClick={() => handlePageChange(pageNumber + 1)}
                >
                  <span aria-hidden="true">»</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default InfoPagination;
