import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { decrypt } from "./Encryptation";
import { ProgressSpinner } from "primereact/progressspinner";
import { auth } from "./TokenValidation";

const CheckAuth = ({ children, requiredType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authToken"))[0];
        const twoFactorAuth = decrypt(
          JSON.parse(localStorage.getItem("twoFactorAuth"))[0]
        );
        const userRole = auth(token).role;

        if (!userRole || userRole !== requiredType) {
          navigate("/");
          return;
        } else if (!twoFactorAuth || twoFactorAuth !== "ValidatedAccessTrue") {
          navigate("/");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [requiredType, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div
        className="bg-gradient-primary"
        style={{ height: "100vh", alignContent: "center" }}
      >
        <div className="container d-flex justify-content-center align-items-center">
          <div className="card d-flex justify-content-center align-items-center">
            {isLoading ? <ProgressSpinner /> : null}
          </div>
        </div>
      </div>
    );
  }

  return children;
};

const CheckAuthSecondValidation = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const secondAccess = decrypt(
          JSON.parse(localStorage.getItem("secondAccess"))[0]
        );
        if (!secondAccess || secondAccess !== "true") {
          navigate("/");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div
        className="bg-gradient-primary"
        style={{ height: "100vh", alignContent: "center" }}
      >
        <div className="container d-flex justify-content-center align-items-center">
          <div className="card d-flex justify-content-center align-items-center">
            {isLoading ? <ProgressSpinner /> : null}
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export { CheckAuth, CheckAuthSecondValidation };
