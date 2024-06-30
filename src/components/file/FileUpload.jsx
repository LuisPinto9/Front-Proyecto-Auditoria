import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [image2, setImage2] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const trueImage = JSON.parse(localStorage.getItem("imageURL"));

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    setIsUploading(true); // Iniciar el spinner antes de la petición

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.text();
      setImage2(result);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false); // Detener el spinner después de la petición
    }
  };

  const handleLogin = async () => {
    setIsLoading(true); //nicia elSpinner
    const loginData = {
      imageUrl1: trueImage[0],
      imageUrl2: image2,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos

    try {
      const startTime = Date.now();

      const response = await fetch(
        "https://face-match-lxpiymvlcq-uc.a.run.app/face/compare",
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
        console.error("Error:", responseData);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        //aqui se verifica si funciona o no
        const result = JSON.parse(responseData);
        if (result.isSamePerson) {
          //localStorage.removeItem("imageURL");
          navigate("/listTopic");
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("La solicitud excedió el tiempo límite de 60 segundos");
      } else {
        console.error("Error:", error);
      }
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  };
  return (
    <>
      <input
        className="inputFile beautifulInputFile"
        type="file"
        onChange={handleFileChange}
      />

      <button
        className="btn btn-success d-block btn-user w-100 butonUploadFile"
        onClick={uploadFile}
      >
        Upload
      </button>

      <div className="card flex justify-content-center">
        {isUploading ? <ProgressSpinner /> : null}
      </div>

      <button
        className="btn btn-primary d-block btn-user w-100 butonFacial"
        onClick={handleLogin}
      >
        Iniciar Sesión
      </button>

      <div className="card flex justify-content-center">
        {isLoading ? <ProgressSpinner /> : null}
      </div>
    </>
  );
};

export default FileUpload;
