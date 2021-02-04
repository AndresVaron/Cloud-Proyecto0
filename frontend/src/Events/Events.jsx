import React from "react";
import { withRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../AxiosAPI.js";

import "./Events.css";

function Events(props) {
  const [events, setEvents] = useState();
  useEffect(() => {
    if (props.user === null) {
      props.history.push("/");
    }
    axiosInstance
      .get("eventos?correo=" + props.user.correo + "&clave=" + props.user.clave)
      .then((resp) => {
        setEvents(resp.data);
      });
  }, []);

  const renderEventos = () => {
    if (events !== undefined) {
      return events.map((event) => {
        return (
          <div
            className="contEventList"
            key={event.id}
            onClick={() => {
              props.history.push(`/events/${event.id}`);
            }}
          >
            {event.nombre}, Fecha: {event.fechaIni}
          </div>
        );
      });
    }
  };

  return (
    <React.Fragment>
      <div className="divLoginAdmin">
        <div className="ContainerEvents">
          <div className="labelEventos">Eventos de {props.user.correo} </div>
          {renderEventos()}
          <div className="divBotonLogin">
            <button
              className="botonLogin myOutline"
              onClick={() => {
                props.history.push("/create/undefined");
              }}
            >
              Crear
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Events);
