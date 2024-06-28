import React, { useState } from "react";

const Login = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:4000/login/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.text();
    setResponse(result);
  };

  return (
    <div className="bg-gradient-primary" style={{ height: "100vh" }}>
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
                      }}
                    ></div>
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h4 className="text-dark mb-4">Inicio de Sesión</h4>
                      </div>
                      <form className="user" id="login-form">
                        <div className="mb-3">
                          <input
                            className="form-control form-control-user"
                            type="email"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email Address..."
                            name="email"
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            className="form-control form-control-user"
                            type="password"
                            id="exampleInputPassword"
                            placeholder="Password"
                            name="password"
                          />
                        </div>
                        <div className="mb-3">
                          <div className="custom-control custom-checkbox small"></div>
                        </div>
                        <button
                          className="btn btn-primary d-block btn-user w-100"
                          type="submit"
                          id="login-form"
                        >
                          Iniciar Sesión
                        </button>
                      </form>
                      <input type="file" onChange={handleFileChange} />
                      <button onClick={uploadFile}>Upload</button>
                      <img src={response} alt="" />
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

export default Login;
