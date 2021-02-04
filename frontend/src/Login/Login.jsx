import React from "react";
import { withRouter } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../AxiosAPI.js";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function hacerLogin() {
    try {
      console.log({
        correo: email,
        clave: password,
      });
      //Manda la peticion atravez de axios.
      const response = await axiosInstance.post("/login", {
        correo: email,
        clave: password,
      });
      if (response.data !== undefined && response.status === 200) {
        localStorage.setItem("correo", email);
        localStorage.setItem("clave", password);
        window.location.reload();
      }
      //Falta manejar los casos cuando no haga login.
    } catch (error) {
      console.error(error);
    }
  }

  async function Registrarse() {
    try {
      //Manda la peticion atravez de axios.
      const response = await axiosInstance.post("/usuarios", {
        correo: email,
        clave: password,
      });
      if (response.data !== undefined && response.status === 200) {
        localStorage.setItem("correo", email);
        localStorage.setItem("clave", password);
        window.location.reload();
      }
      //Falta manejar los casos cuando no haga login.
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <React.Fragment>
      <div className="divLoginAdmin">
        <div className="loginAdmin">
          <div className="form-group">
            <label className="labelLogin">Correo electrónico:</label>
            <br></br>
            <input
              name="email"
              type="email"
              placeholder="Ingrese su correo electrónico"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  hacerLogin();
                }
              }}
            />
          </div>

          <div className="form-group">
            <label className="labelLogin">Contraseña:</label>

            <input
              name="clave"
              type="password"
              placeholder="Ingrese su contraseña"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  hacerLogin();
                }
              }}
            />
          </div>
          <div className="divBotonLogin">
            <button
              className="botonLogin myOutline"
              onClick={() => {
                hacerLogin();
              }}
            >
              Iniciar Sesión
            </button>
          </div>
          <div className="divBotonLogin">
            <button
              className="botonLogin myOutline"
              onClick={() => {
                Registrarse();
              }}
            >
              Registarse
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Login);
