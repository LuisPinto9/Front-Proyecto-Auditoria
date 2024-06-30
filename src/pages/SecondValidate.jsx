
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { SaveLocalStorage } from "./SaveLocalStorage";
import Webcam from "react-webcam";

const SecondValidate = () => {
  const [file, setFile] = useState(null);
  const [image2, setImage2] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [response, setResponse] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
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
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setResponse(imageSrc);
    setShowWebcam(false);
  };


  const uploadCapturedImage = async () => {
    if (capturedImage) {
     
      const blob = await fetch(capturedImage).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "capturedImage.jpg");

      const response = await fetch("http://localhost:4000/login/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      // SaveLocalStorage("imageCapture",result)
      alert(result);
    }
  };


  return (
    <div>
      <div className="bg-gradient-info" style={{ height: "100vh" }}>
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-12 col-xl-10">
              <div className="card shadow-lg o-hidden border-0 my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-6 d-none d-lg-flex">
                      <div
                       className="flex-grow-1 bg-login-image"
                       style={{
                         backgroundImage: `url(${
                           response ? response : "images/dogs/image3.jpeg"
                         })`,
                         position: "relative",
                         height: "100%",
                         width: "100%",
                       }}
                     >{/* fotos */}
                      {showWebcam && (
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 20,
                          height: "100%",
                          width: "100%",
                        }}
                        
                      />
                      
                    )}</div>
                    </div>
                    <div className="col-lg-6">
                      <div className="p-5">
                        <div className="text-center">
                          <h4 className="text-dark mb-4">
                            Autenticacion Facial
                          </h4>
                        </div>
                        <div className="user" id="login-form">
                          <div className="mb-3">
                            <div className="custom-control custom-checkbox small"></div>

                            <>
                              

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
                            
                          </div>
                        </div>


                        <div  className="p-1">
                      {/* <input type="file" onChange={handleFileChange} /> */}
                      <button  className="btn btn-primary d-block btn-user w-100" type="submit"
                           onClick={showWebcam ? captureImage : () => {setShowWebcam(true); setResponse("images/dogs/blanco.jpeg");}}>
                        {showWebcam ? "capturar imagen" : "mostrar camara"}
                      </button>
                      </div>
                      <div  className="p-1">
                      {capturedImage && (
                        <button className="btn btn-primary d-block btn-user w-100" type="submit"
                         onClick={uploadCapturedImage}>guardar imagen</button>
                      )}
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
    </div>
  );
};

export default SecondValidate;
