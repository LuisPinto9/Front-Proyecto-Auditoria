import React, { useEffect, useState } from "react";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { Fieldset } from "primereact/fieldset";
import { ProgressSpinner } from "primereact/progressspinner";
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
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [userInformation, setUserInformation] = useState({});
  const [userAcademic, setUserAcademic] = useState({});
  const [userFacultad, setUserFacultad] = useState({});
  const [imageWidth, setImageWidth] = useState(224); // Estado para manejar el ancho de la imagen

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedUser = await decodeToken();
        setUser(decodedUser);
        setIsLoadingImage(true);
        const image = await getImageUser(decodedUser);
        setUserImage(image);
        setIsLoadingImage(false);

        const informationUser = await getInformationUser(decodedUser.email);
        setUserInformation(informationUser[0]);
      } catch (error) {
        console.error("Error fetching data", error);
        setIsLoadingImage(false);
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
          console.log(academicInfo.faculty.name);
          setUserFacultad(academicInfo.faculty);
        } catch (error) {
          console.error("Error fetching academic information", error);
        }
      }
    };

    fetchAcademicInformation();
  }, [userInformation]);

  // Efecto para manejar el cambio de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 775) {
        setImageWidth(150);
      } else {
        setImageWidth(224);
      }
    };

    window.addEventListener('resize', handleResize);

    // Ejecutar la función de inmediato para ajustar el tamaño inicial
    handleResize();

    // Limpiar el event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="card flex p-4 m-4">
      <Card title="Información del usuario">
        <div className="user-info-container">
          <div className="user-image">
            {isLoadingImage ? (
              <ProgressSpinner />
            ) : (
              <Image className="userImage" src={userImage} alt="Image" width={`${imageWidth}`} preview />
            )}
          </div>

          <div className="user-details">
            <Fieldset legend="Información Básica" toggleable>
              <div className="m-0 infoUser">
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
            <Fieldset legend="Datos del programa"  toggleable>
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
