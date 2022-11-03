import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import classNames from "classnames";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  const listItems = props.interviewers.map((interviewer) =>
    <InterviewerListItem
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={props.interviewer === interviewer.id}
      setInterviewer={() => props.setInterviewer(interviewer.id)}
    />
  );
  return (

    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {listItems}
      </ul>
    </section>

  );
}
