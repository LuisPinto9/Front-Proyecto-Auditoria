import React, { useState} from "react";
import { SaveLocalStorage } from "./SaveLocalStorage"; 
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();



  const handleLogin = async (event) => {
    event.preventDefault();
    const loginData = { username: email, password };

    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

    if (result.state) {
      SaveLocalStorage("authToken", result.token);
      SaveLocalStorage("imageURL",result.data.image)
      navigate("/secondValidation"); 
    } else {
      alert("Error en el inicio de sesión: " + result.error);
    }
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
                        backgroundImage: `url(${"images/dogs/image3.jpeg"
                        })`,
                        height: "100%",
                        width: "100%",
                      }}
                    ></div>
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h4 className="text-dark mb-4">Inicio de Sesión</h4>
                      </div>
                      <form className="user" id="login-form" onSubmit={handleLogin}>
                        <div className="mb-3">
                          <input
                            className="form-control form-control-user"
                            type="email"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email Address..."
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            className="form-control form-control-user"
                            type="password"
                            id="exampleInputPassword"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <div className="custom-control custom-checkbox small"></div>
                        </div>
                        <button
                          className="btn btn-primary d-block btn-user w-100"
                          type="submit"
                        >
                          Iniciar Sesión
                        </button>
                      </form>
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
