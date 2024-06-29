import React from "react";
import FileUpload from "../components/file/FileUpload";

const SecondValidate = () => {
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
                          backgroundImage: `url(${"images/dogs/securityDog.jpg"})`,
                          height: "100%",
                          width: "100%",
                        }}
                      ></div>
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
                            <FileUpload />
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
    </div>
  );
};

export default SecondValidate;
