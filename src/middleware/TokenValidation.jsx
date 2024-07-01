import { jwtDecode } from "jwt-decode";
import moment from "moment";

export const auth = (token) => {
  if (!token) {
    throw new Error("No hay token");
  }

  try {
    const payload = jwtDecode(token);
    if (payload.exp <= moment().unix()) {
      throw new Error("Token expirado");
    }
    return payload;
  } catch (error) {
    throw new Error("Token inválido");
  }
};
