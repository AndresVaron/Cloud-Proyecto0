import React from "react";
import { withRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../AxiosAPI.js";

import "./Event.css";

function Event(props) {
  const [event, setEvent] = useState({});
  useEffect(() => {
    if (props.user === null) {
      props.history.push("/");
    } else {
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
          setEvent(resp.data);
        });
    }
  }, []);

  const Del = () => {
    axiosInstance
      .delete(
        "/eventos/" +
          props.match.params.id +
          "?correo=" +
          props.user.correo +
          "&clave=" +
          props.user.clave
      )
      .then(() => {
        props.history.push("/");
      });
  };
  return (
    <React.Fragment>
      <div className="divLoginAdmin">
        <div className="divEventDet">
          <label className="labelDetail">Nombre: {event.nombre}</label>
          <br></br>
          <label className="labelDetail">Categoria: {event.categoria}</label>
          <br></br>
          <label className="labelDetail">Lugar: {event.lugar}</label>
          <br></br>
          <label className="labelDetail">Direccion: {event.direccion}</label>
          <br></br>
          <label className="labelDetail">
            Fecha de Inicio: {event.fechaIni}
          </label>
          <br></br>
          <label className="labelDetail">Fecha de Fin: {event.fechaFin}</label>
          <br></br>
          <label className="labelDetail">
            Es Presencial: {event.presencial == 1 ? "Si" : "No"}
          </label>
          <br></br>
          <div className="divBotonLogin">
            <button
              className="botonLogin myOutline"
              onClick={() => {
                Del();
              }}
            >
              Borrar
            </button>
          </div>
          <div className="divBotonLogin">
            <button
              className="botonLogin myOutline"
              onClick={() => {
                props.history.push("/create/" + event.id);
              }}
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Event);
