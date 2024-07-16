import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Toast } from "primereact/toast";

const ModalGroups = ({
  groups,
  isLoadingModal,
  haveAvailableGroups,
  studentGroups,
  updateGroups,
  topicId,
}) => {
  const toast = useRef(null);
  const [disabledGroups, setDisabledGroups] = useState([]);

  useEffect(() => {
    const disabled = studentGroups.map((inscription) => inscription.group._id);
    setDisabledGroups(disabled);
  }, [studentGroups]);

  const createInscription = async (groupId) => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      await axios.post(`http://localhost:4000/inscriptions/save`, {
        student: {
          _id: jwtDecode(JSON.parse(localStorage.getItem("authToken"))[0])
            .objectId,
        },
        group: { _id: groupId },
        registrationDate: currentDate,
      });
      toast.current.show({
        severity: "success",
        summary: "Inscripción exitosa",
        detail: "Se ha inscrito correctamente al grupo",
      });
      setDisabledGroups((prev) => [...prev, groupId]);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al inscribirse al grupo",
      });
    }
    try {
      updateGroups(topicId);
    } catch (error) {}
  };

  const isStudentInGroup = (groupId) => {
    return disabledGroups.includes(groupId);
  };

  return (
    <>
      <Toast ref={toast} />
      <div
        className="modal fade"
        id="availableGroups"
        tabIndex="-1"
        aria-labelledby="Grupos disponibles"
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
                Grupos disponibles
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
                <div className="card-body">
                  <div className="loading-overlay">
                    <i
                      className="pi pi-spin pi-spinner"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                </div>
              )}
              {!isLoadingModal && groups.length === 0 && (
                <div className="no-data-message">
                  No hay grupos disponibles...
                </div>
              )}
              {!isLoadingModal && haveAvailableGroups && (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr style={{ textAlign: "center" }}>
                        <th scope="col">Nombre del Grupo</th>
                        <th scope="col">Grupo</th>
                        <th scope="col">Cupos</th>
                        <th scope="col">Inscribirse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((group) => (
                        <tr key={group._id} style={{ textAlign: "center" }}>
                          <td>{group.name}</td>
                          <td>{group.grupo}</td>
                          <td>{group.quotas}</td>
                          <td>
                            <i
                              className={`pi pi-plus-circle ${
                                isStudentInGroup(group._id)
                                  ? "disabled-button"
                                  : "enabled-button"
                              }`}
                              type="button"
                              onClick={() =>
                                !isStudentInGroup(group._id) &&
                                createInscription(group._id)
                              }
                            ></i>
                          </td>
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

export default ModalGroups;
