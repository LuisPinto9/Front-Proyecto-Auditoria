import React, { useEffect, useState } from "react";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { Fieldset } from "primereact/fieldset";
import axios from "axios";

const decodeToken = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("authToken"))[0];
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/login/decode`,
      { token }
    );
    return response.data.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Network response was not ok");
  }
};

const getImageUser = async (user) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/findUsername/${user.emailToken}`
    );
    return response.data.data.image;
  } catch (error) {
    console.error(error.message);
  }
};

const getInformationUser = async (email) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/students/findEmail`,
      { email }
    );
    return response.data.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Network response was not ok");
  }
};

const getAcademicInformation = async (idProgram) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/programs/findById/${idProgram}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error.message);
  }
};

const UserInformation = () => {
  const [user, setUser] = useState({});
  const [userImage, setUserImage] = useState("");
  const [userInformation, setUserInformation] = useState({});
  const [userAcademic, setUserAcademic] = useState({});
  const [userFacultad, setUserFacultad] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedUser = await decodeToken();
        setUser(decodedUser);
        const image = await getImageUser(decodedUser);
        setUserImage(image);

        const informationUser = await getInformationUser(decodedUser.email);
        setUserInformation(informationUser[0]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAcademicInformation = async () => {
      if (userInformation.program) {
        try {
          const academicInfo = await getAcademicInformation(
            userInformation.program
          );
          setUserAcademic(academicInfo);
          setUserFacultad(academicInfo.faculty);
        } catch (error) {
          console.error("Error fetching academic information", error);
        }
      }
    };

    fetchAcademicInformation();
  }, [userInformation]);

  return (
    <div className="card flex p-4 m-4">
      <Card title="Información del usuario">
        <div className="user-info-container">
          <div className="user-image">
            <Image src={userImage} alt="Image" width="224" preview />
          </div>

          <div className="user-details">
            <Fieldset legend="Información Básica" toggleable>
              <div className="infoUser">
                <div>
                  <p>
                    <strong>Nombre: </strong> {userInformation.firstName}
                  </p>
                  <p>
                    <strong>Apellido:</strong> {userInformation.lastName}
                  </p>
                  <p>
                    <strong>Id:</strong> {userInformation.id}
                  </p>
                  <p>
                    <strong>Tipo documento:</strong>{" "}
                    {userInformation.documentType}
                  </p>
                  <p>
                    <strong>Identificación:</strong>{" "}
                    {userInformation.Identification}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Código:</strong> {userInformation.code}
                  </p>
                  <p>
                    <strong>Fecha de nacimiento:</strong>{" "}
                    {new Date(userInformation.birthdate).toLocaleDateString(
                      "es-ES",
                      { day: "numeric", month: "numeric", year: "numeric" }
                    )}
                  </p>
                  <p>
                    <strong>Celular:</strong> {userInformation.cellphone}
                  </p>
                  <p>
                    <strong>Email:</strong> {userInformation.email}
                  </p>
                </div>
              </div>
            </Fieldset>
            <Fieldset legend="Datos del programa" toggleable>
              <div className="infoUser">
                <div>
                  <p>
                    <strong>Nombre Programa:</strong> {userAcademic.name}
                  </p>
                  <p>
                    <strong>Nivel:</strong> {userAcademic.level}
                  </p>
                  <p>
                    <strong>Código SNIES:</strong> {userAcademic.snies_code}
                  </p>
                  <p>
                    <strong>Modalidad:</strong> {userAcademic.modality}
                  </p>
                  <p>
                    <strong>Localización:</strong> {userAcademic.location}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Facultad:</strong> {userFacultad.name}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {userFacultad.ubication}
                  </p>
                  <p>
                    <strong>Telefono:</strong> {userFacultad.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {userFacultad.email}
                  </p>
                </div>
              </div>
            </Fieldset>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserInformation;
