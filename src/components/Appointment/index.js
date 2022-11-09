import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRMING = "CONFIRMING";
const EDITING = "EDITING";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      });
  }

  function onDelete() {
    transition(DELETING);
    props.deleteAppointment(props.id)
      .then(() => {
        transition(EMPTY);
      });
  }

  return (
    <article className="appointment">

      <Header time={props.time}>  </Header>
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onSave={save}
        onCancel={() => back()}
      />}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRMING)}
          onEdit={() => transition(EDITING)}
        />
      )}
      {mode === CONFIRMING && <Confirm
        onCancel={() => back()}
        onConfirm={onDelete}
      />}

       {mode === EDITING && <Form
        interviewers={props.interviewers}
        onSave={save}
        onCancel={() => back()}
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      />}

      {mode === DELETING && <Status message={"Deleting"} />}

      {mode === SAVING && <Status message={"Saving"} />}

    </article>
  );
}
