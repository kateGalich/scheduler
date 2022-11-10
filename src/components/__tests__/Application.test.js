import React from "react";

import { render, cleanup, waitForElement, getByText, prettyDOM, getAllByTestId, fireEvent, getByAltText, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";

const { getyByText } = render(<Application />);

afterEach(cleanup);

describe("Application", () => {
  

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"));
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointments, "Add"));

    fireEvent.change(getByPlaceholderText(appointments, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointments, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointments, "Save"));


    console.log(prettyDOM(container));
    console.log(prettyDOM(appointments));
  });

});
