
export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const d = state.days.find(x => x.name === day);
  if (!d) {
    return [];
  }
  const result = [];
  for (let appointmentId of d.appointments) {
    result.push(state.appointments[appointmentId]);
  }

  return result;
}


export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };
}


export function getInterviewersForDay(state, day) {
  const d = state.days.find(x => x.name === day);
  if (!d) {
    return [];
  }
  const result = [];
  for (let interviewerId of d.interviewers) {
    result.push(state.interviewers[interviewerId]);
  }
  return result;
}
