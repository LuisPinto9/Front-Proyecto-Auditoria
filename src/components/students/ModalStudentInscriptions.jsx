import React from "react";

const ModalStudentInscriptions = ({ groups }) => {
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
                style={{ fontWeight: "bold" }}
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
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre del Grupo</th>
                      <th scope="col">Grupo</th>
                      <th scope="col">Cupos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group, index) => (
                      <tr key={group._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{group.name}</td>
                        <td>{group.grupo}</td>
                        <td>{group.quotas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalStudentInscriptions;
