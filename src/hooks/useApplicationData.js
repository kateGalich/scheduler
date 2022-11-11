import React, { useState, useEffect } from "react";
import axios from "axios";
import { func } from "prop-types";

export default function useApplicationData(initialMode) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState(prev => ({ ...prev, day }));

  function updateSpots(state) {
    for (let day of state.days) {
      day.spots = 0;
      for (let appointmentId of day.appointments) {
        if (//appointmentId != day.appointments[day.appointments.length - 1] &&
          state.appointments[appointmentId].interview === null) {
          day.spots++;
        }
      }
    }
  }

  function bookInterview(id, interview) {

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        setState(prev => {
          const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
          };

          let newAppointments = {
            ...prev.appointments,
          };

          newAppointments[id] = appointment;

          const newState = {
            ...prev,
            appointments: newAppointments
          };

          updateSpots(newState);

          return newState;
        });
      });
  }

  function deleteAppointment(id) {
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        setState(prev => {

          let newAppointments = {
            ...prev.appointments,
          };
          newAppointments[id].interview = null;
          const newState = {
            ...prev,
            appointments: newAppointments
          };
          updateSpots(newState);

          return newState;
        });
      });
  }
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  return { state, setDay, bookInterview, deleteAppointment };
}
