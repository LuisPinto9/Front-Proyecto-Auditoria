import React from "react";

const ModalStudentInscriptions = ({
  groups,
  isLoadingModal,
  haveAvailableGroups,
}) => {
  return (
    <>
      <div
        className="modal fade"
        id="modalGroups"
        tabIndex="-1"
        aria-labelledby="Modal de Grupos"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="Modal de Grupos"
                style={{ fontWeight: "bold", color: "black" }}
              >
                Asignaturas Inscritas
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {isLoadingModal && (
                <div className="loading-overlay">
                  <i
                    className="pi pi-spin pi-spinner"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              )}
              {!isLoadingModal && groups.length === 0 && (
                <div className="no-data-message">
                  El estudiante no tiene inscripciones...
                </div>
              )}
              {!isLoadingModal && haveAvailableGroups && (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Nombre del Grupo</th>
                        <th scope="col">Grupo</th>
                        <th scope="col">Cupos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((group) => (
                        <tr key={group._id}>
                          <td>{group.name}</td>
                          <td>{group.grupo}</td>
                          <td>{group.quotas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalStudentInscriptions;
