import React from "react";

import { render, cleanup } from "@testing-library/react";

import Form from "components/Appointment/Form";
import { fireEvent } from "@testing-library/react";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      student: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];
  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(<Form
      interviewers={[]} />);
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(<Form
      student={"Lydia Miller-Jones"}
      interviewers={[]} />);
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });


  it("validates that the student name is not blank", () => {
    /* 1. validation is shown */
    const save = jest.fn();
    const { getByText } = render(
      <Form
        onSave={save}
        interviewers={[]} />);
    fireEvent.click(getByText("Save"));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();

    /* 2. onSave is not called */
    expect(save).not.toHaveBeenCalled();
  });

  it("validates that the interviewer cannot be null", () => {
    /* 3. validation is shown */
    const save = jest.fn();
    const { getByText } = render(<Form
      onSave={save}
      interviewers={[]}
      student="Lydia Miller-Jones" />);
    fireEvent.click(getByText("Save"));
    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    /* 4. onSave is not called */
    expect(save).not.toHaveBeenCalled();
  });

  it("calls onSave function when the name is defined", () => {
    /* 5. validation is not shown */
    const save = jest.fn();
    const interviewers = [{ id: 1, name: "Sylvia Palmer", avatar: "https://i.imgur.com/LpaY82x.png" }];
    const { getByText, queryByText } = render(
      <Form
        onSave={save}
        student="Lydia Miller-Jones"
        interviewers={interviewers}
        interviewer={interviewers[0]}
      />);
    fireEvent.click(getByText("Save"));
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/please select an interviewer/i)).toBeNull();

    /* 6. onSave is called once*/
    expect(save).toHaveBeenCalledTimes(1);

    /* 7. onSave is called with the correct arguments */
    expect(save).toHaveBeenCalledWith("Lydia Miller-Jones", interviewers[0]);
  });

});
