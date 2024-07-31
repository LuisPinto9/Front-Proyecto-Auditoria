import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import Webcam from "react-webcam";
import { encrypt } from "../middleware/Encryptation";
import axios from "axios";
import { Toast } from "primereact/toast";

const LosePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [response, setResponse] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const toast = useRef(null);
  const navigate = useNavigate();
  const [trueImage, setTrueImage] = useState("");
  const [recovered, setRecovered] = useState(false);

  function generatePassword(length) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  const searchUsername = async () => {
    setIsLoading(true);
    if (username) {
      setIsSearching(true);
      let encryptedUsername = encrypt(username);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/users/findUsername/${encryptedUsername}`
        );
        const user = response.data.data;
        setUserID(user._id);
        setTrueImage(user.image);
      } catch (error) {
        console.error("Error al buscar el usuario:", error);
        toast.current.show({
          severity: "warn",
          summary: "Advertencia",
          detail: "Error al buscar el usuario",
        });
      } finally {
        setIsSearching(false);
      }
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Error al encontrar el usuario",
      });
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const sendMail = async () => {
    setIsLoading(true);
    try {
      const newPassword = generatePassword(12);
      await changePassword(newPassword);
      await axios.post(`${import.meta.env.VITE_API_URL}/mail/sendmail`, {
        email: username,
        subject: "Recuperación de contraseña",
        message: `
          <p>Hola,</p>
          <p>Hemos verificado correctamente tu solicitud de recuperación de contraseña. Tu nueva contraseña es: <strong>${newPassword}</strong></p>
          <p>Por favor, inicia sesión en la aplicación y cambia tu contraseña.</p>
        `,
      });
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Error al enviar el correo",
      });
      setIsLoading(false);
    }
  };

  const changePassword = async (newPassword) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/update/${userID}`,
        {
          password: newPassword,
        }
      );
    } catch (error) {}
  };

  const handleRecoverPassword = async () => {
    setIsLoading(true);
    setRecovered(false);
    const image2 = await uploadCapturedImage();

    while (isUploading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (!image2) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Error al subir la imagen",
      });
      return;
    }

    searchUsername();

    if (!isSearching && trueImage) {
      const loginData = {
        imageUrl1: encrypt(trueImage),
        imageUrl2: image2,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 100000);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_FACE_API_URL}/face/compare`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        const responseData = await response.text();

        if (!response.ok) {
          toast.current.show({
            severity: "warn",
            summary: "Advertencia",
            detail: responseData,
          });
        } else {
          const result = JSON.parse(responseData);
          if (result.isSamePerson) {
            await sendMail();
            setRecovered(true);
            navigate("/");
          } else {
            toast.current.show({
              severity: "warn",
              summary: "Advertencia",
              detail: "No concuerdan los rostros",
            });
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
          toast.current.show({
            severity: "warn",
            summary: "Advertencia",
            detail: "La solicitud excedió el tiempo límite de 60 segundos",
          });
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Advertencia",
            detail: error.toString(),
          });
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
    setIsLoading(false);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setResponse(imageSrc);
    setShowWebcam(false);
  };

  const uploadCapturedImage = async () => {
    setIsLoading(true);
    if (capturedImage) {
      setIsUploading(true);
      try {
        const uniqueTimestamp = new Date().toISOString().replace(/[:.-]/g, "");

        const blob = await fetch(capturedImage).then((res) => res.blob());
        const fileType = blob.type;
        let fileExtension = "";

        if (fileType === "image/jpeg") {
          fileExtension = "jpg";
        } else if (fileType === "image/png") {
          fileExtension = "png";
        } else {
          throw new Error("Unsupported image format");
        }

        const uniqueFileName = `capturedImage_${uniqueTimestamp}.${fileExtension}`;
        const formData = new FormData();
        formData.append("file", blob, uniqueFileName);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/login/uploadTemporal`,
          {
            method: "POST",
            body: formData,
          }
        );

        return await response.text();
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div>
      <Toast ref={toast}></Toast>
      <div className="bg-gradient-primary" style={{ height: "100vh" }}>
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-12 col-lg-6 order-1 order-lg-1 mb-3">
              <div
                className="bg-login-image"
                style={{
                  backgroundImage: `url(${
                    response ? response : "images/dogs/image3.jpeg"
                  })`,
                  position: "relative",
                  height: "300px",
                  width: "100%",
                  borderRadius: "10px",
                }}
              >
                {showWebcam && (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                      borderRadius: "10px",
                    }}
                    mirrored={true}
                  />
                )}
              </div>
            </div>
            <div className="col-12 col-lg-6 order-2 order-lg-1">
              <div className="card shadow-lg o-hidden border-0 my-3">
                <div className="card-body p-0">
                  <div className="p-5">
                    <div className="text-center">
                      <h4 className="text-dark mb-4">
                        Recuperación de Contraseña
                      </h4>
                      <div className="card mb-3"></div>
                    </div>
                    <div className="user">
                      {(isLoading && !recovered) && (
                        <div className="loading-overlay">
                          <ProgressSpinner />
                        </div>
                      )}
                      <div className="mb-3">
                        <p className="text-center">
                          Ingrese su correo electrónico para cambiar su
                          contraseña.
                        </p>
                        <input
                          type="text"
                          className="form-control my-3"
                          placeholder="Correo electrónico"
                          aria-label="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          id="username"
                        />
                        <button
                          className="btn btn-success d-block btn-user w-100 mb-3"
                          type="submit"
                          onClick={
                            showWebcam
                              ? captureImage
                              : () => {
                                  setShowWebcam(true);
                                  setResponse("images/dogs/blanco.jpeg");
                                }
                          }
                        >
                          {showWebcam
                            ? "Capturar imagen"
                            : capturedImage
                            ? "Reemplazar imagen"
                            : "Mostrar camara"}
                        </button>
                        <button
                          className="btn btn-primary d-block btn-user w-100 butonFacial"
                          onClick={handleRecoverPassword}
                          disabled={!capturedImage}
                        >
                          Enviar Correo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LosePassword;
