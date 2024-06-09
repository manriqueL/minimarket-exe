import axios from "axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [sesion, setSesion] = useState();

  const login = async (username, password, callback, error) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token",response.data.token)
        setSesion(response.data);
        callback();
      }
    } catch (e) {
      alert("Error al ingresar. Revise usuario y/o clave")
      error();
    }
  };

  const logout = (callback) => {
    setSesion(null);
    localStorage.removeItem("token")
    callback();
  };

  const value = { sesion, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
