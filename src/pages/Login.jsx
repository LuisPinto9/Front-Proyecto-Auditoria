import React, { useState, useRef } from "react";
import { SaveLocalStorage } from "../middleware/SaveLocalStorage";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { encrypt } from "../middleware/Encryptation";
import { ProgressSpinner } from "primereact/progressspinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleLogin = async (event) => {
    setIsLoading(true);
    try {
      event.preventDefault();
      const loginData = { username: email, password };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      SaveLocalStorage("authToken", result.token);
      SaveLocalStorage("secondAccess", encrypt("true"));
      SaveLocalStorage("imageURL", result.data.image);
      navigate("/secondValidation");
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error de inicio de sesión",
        detail: "Revise el usuario o contraseña.",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleForgotPassword = () => {
    navigate('/losePassword');
  };

  return (
    <div className="bg-gradient-primary" style={{ height: "100vh" }}>
      <Toast ref={toast} />
      <div className="container h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-12 col-xl-10">
            <div className="card shadow-lg o-hidden border-0 my-5">
              <div className="card-body p-0">
                {isLoading && (
                  <div className="loading-overlay">
                    <ProgressSpinner />
                  </div>
                )}
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-flex">
                    <div
                      className="flex-grow-1 bg-login-image"
                      style={{
                        backgroundImage: `url(${"images/dogs/image3.jpeg"})`,
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
                      <form
                        className="user"
                        id="login-form"
                        onSubmit={handleLogin}
                      >
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
                            type={showPassword ? "text" : "password"}
                            id="exampleInputPassword"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                handleLogin(e);
                              }
                            }}
                          />
                        </div>
                        <div className="mb-3 form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="showPasswordCheck"
                            checked={showPassword}
                            onChange={togglePasswordVisibility}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="showPasswordCheck"
                          >
                            {showPassword ? "Ocultar" : "Mostrar"} Contraseña
                          </label>
                          <div className="mb-3">
                            <button
                              onClick={handleForgotPassword}
                              className="btn btn-link">
                              ¿Has olvidado tu contraseña?
                            </button>
                          </div>
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
