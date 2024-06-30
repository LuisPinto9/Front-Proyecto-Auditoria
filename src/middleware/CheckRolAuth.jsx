import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CheckRolAuth = ({ tipoRequerido, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tipoUsuario = localStorage.getItem("tipo");

    if (!tipoUsuario || tipoUsuario !== tipoRequerido) {
      // Redirigir al usuario a la página 404 si el tipo de usuario no coincide
      navigate("/404");
    }
  }, [tipoRequerido, navigate, location.pathname]);

  return children;
};

export default CheckRolAuth;