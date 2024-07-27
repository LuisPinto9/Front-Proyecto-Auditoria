import React, { useState, useRef, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import Webcam from "react-webcam";
import { SaveLocalStorage } from "../middleware/SaveLocalStorage";
import { encrypt } from "../middleware/Encryptation";
import { jwtDecode } from "jwt-decode";
const LosePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [response, setResponse] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const toast = useRef(null);
 
  const trueImage = JSON.parse(localStorage.getItem("imageURL"));

  const handleRecoverPassword= async () => {
    setIsLoading(true);

    const image2 = await uploadCapturedImage();

    // Esperar hasta que isUploading sea false
    while (isUploading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (!image2) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Error al subir la imagen",
      });
      setIsLoading(false);
      return;
    }

    const loginData = {
      imageUrl1: trueImage[0], 
      imageUrl2: image2, 
      userData:{username}

    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos

    try {
      const startTime = Date.now();

      const response = await fetch(
        `${import.meta.env.VITE_FACE_API_URL}/recoverPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
          signal: controller.signal,
        }
      );

      const endTime = Date.now();
      console.log(`Respuesta recibida en ${endTime - startTime} ms`);

      clearTimeout(timeoutId);

      console.log("Status:", response.status);
      console.log("StatusText:", response.statusText);
      console.log("Headers:", Object.fromEntries(response.headers.entries()));

      const responseData = await response.text();
      console.log("Response:", responseData);

      if (!response.ok) {
        toast.current.show({
          severity: "warn",
          summary: "Advertencia",
          detail: responseData,
        });
      } else {
        const result = JSON.parse(responseData);
        if (result.isSamePerson) {
          console.log("envio de correo exitoso")
          navigator("/login");
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
          detail: error,
        });
      }
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setResponse(imageSrc);
    setShowWebcam(false);
  };

  const uploadCapturedImage = async () => {
    setIsUploading(true);

    if (capturedImage) {
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
                />
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6 order-2 order-lg-1">
            <div className="card shadow-lg o-hidden border-0 my-3">
              <div className="card-body p-0">
                <div className="p-5">
                  <div className="text-center">
                    <h4 className="text-dark mb-4">Reconocimiento Facial</h4>
                    <div className="card mb-3">
        
                    </div>
                  </div>
                  <div className="user" id="login-form">
                    {isLoading && (
                      <div className="loading-overlay">
                        <ProgressSpinner />
                      </div>
                    )}
                    <div className="mb-3">
                      <div className="custom-control custom-checkbox small"></div>

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
                      <form onSubmit={handleRecoverPassword}>
                          <div>
                            <label htmlFor="username">Usuario:</label>
                            <input
                              id="username"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </div>
                        </form>
                        <button
                          className="btn btn-primary d-block btn-user w-100 butonFacial"
                          onClick={handleRecoverPassword}
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
