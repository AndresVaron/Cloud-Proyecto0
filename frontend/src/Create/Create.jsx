import React from "react";
import { withRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../AxiosAPI.js";

import "./Create.css";

function Create(props) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [lugar, setLugar] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [presencial, setPresencial] = useState(0);

  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (props.user === null) {
      props.history.push("/");
    } else {
      if (props.match.params.id !== undefined) {
        axiosInstance
          .get(
            "/eventos/" +
              props.match.params.id +
              "?correo=" +
              props.user.correo +
              "&clave=" +
              props.user.clave
          )
          .then((resp) => {
            setEditando(true);
            setNombre(resp.data.nombre);
            setCategoria(resp.data.categoria);
            setLugar(resp.data.lugar);
            setDireccion(resp.data.direccion);
            setFechaFin(resp.data.fechaFin);
            setFechaIni(resp.data.fechaIni);
            setPresencial(resp.data.presencial);
          });
      }
    }
  }, []);

  async function Crear() {
    if (props.user === null) {
      props.history.push("/");
    }
    if (props.match.params.id !== undefined) {
      try {
        //Manda la peticion atravez de axios.
        const response = await axiosInstance.put(
          "/eventos/" +
            props.match.params.id +
            "?correo=" +
            props.user.correo +
            "&clave=" +
            props.user.clave,
          {
            nombre,
            categoria,
            lugar,
            direccion,
            fechaIni,
            fechaFin,
            presencial,
          }
        );
        if (response.data !== undefined && response.status === 200) {
          props.history.push("/");
        }
        //Falta manejar los casos cuando no haga login.
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        //Manda la peticion atravez de axios.
        const response = await axiosInstance.post(
          "/eventos?correo=" + props.user.correo + "&clave=" + props.user.clave,
          {
            nombre,
            categoria,
            lugar,
            direccion,
            fechaIni,
            fechaFin,
            presencial,
          }
        );
        if (response.data !== undefined && response.status === 200) {
          props.history.push("/");
        }
        //Falta manejar los casos cuando no haga login.
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <React.Fragment>
      <div className="divLoginAdmin">
        <div className="divCreate">
          <label className="labelLogin">Nombre:</label>
          <br></br>
          <input
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
            }}
          />
          <label className="labelLogin">Categoria:</label>
          <br></br>
          <input
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
            }}
          />
          <label className="labelLogin">Lugar:</label>
          <br></br>
          <input
            value={lugar}
            onChange={(e) => {
              setLugar(e.target.value);
            }}
          />
          <label className="labelLogin">Direccion:</label>
          <br></br>
          <input
            value={direccion}
            onChange={(e) => {
              setDireccion(e.target.value);
            }}
          />
          <label className="labelLogin">Fecha de Inicio:</label>
          <br></br>
          <input
            value={fechaIni}
            onChange={(e) => {
              setFechaIni(e.target.value);
            }}
          />
          <label className="labelLogin">Fecha de Fin:</label>
          <br></br>
          <input
            value={fechaFin}
            onChange={(e) => {
              setFechaFin(e.target.value);
            }}
          />
          <label className="labelLogin">Es Presencial:</label>
          <br></br>
          <input
            value={presencial}
            type="number"
            onChange={(e) => {
              setPresencial(e.target.value);
            }}
          />

          <div className="divBotonLogin">
            <button
              className="botonLogin myOutline"
              onClick={() => {
                Crear();
              }}
            >
              {editando ? "Editar" : "Crear"}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Create);
