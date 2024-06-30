import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { decrypt } from "../middleware/encryptation";

const CheckRolAuth = ({ requiredType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = decrypt(localStorage.getItem("role"));

    if (!userRole || userRole !== requiredType) {
      navigate("/404");
    }
  }, [requiredType, navigate, location.pathname]);
};

export default CheckRolAuth;
