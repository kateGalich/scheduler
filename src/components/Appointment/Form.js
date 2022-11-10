import React, { useState } from "react";
import "components/Appointment/styles.scss";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";



export default function Form(props) {

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");

  function validate() {
    if (student === "") {
      setError1("Student name cannot be blank");
      return;
    } else {
      setError1("");
    }

    if (interviewer === null) {
      setError2("Please select an interviewer");
      return;
    } else {
      setError1("");
    }
    props.onSave(student, interviewer);
  }

  const reset = function() {
    setStudent("");
    setInterviewer(null);
  };
  const cancel = function() {
    reset();
    props.onCancel();
  };
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off"
          onSubmit={event => event.preventDefault()} >
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error1}</section>
          <section className="appointment__validation">{error2}</section>
        </form>
        <InterviewerList
          value={interviewer}
          interviewer={interviewer}
          interviewers={props.interviewers}
          onChange={(interviewer) => setInterviewer(interviewer)}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={validate}>Save</Button>
        </section>
      </section>
    </main>

  );
}