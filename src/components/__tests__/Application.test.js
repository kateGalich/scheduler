import React from "react";
import axios from "axios";
import { render, cleanup, waitForElement, getByText, prettyDOM, getAllByTestId, fireEvent, getByAltText, getByPlaceholderText, queryByText, getByDisplayValue } from "@testing-library/react";

import Application from "components/Application";
import Appointment from "components/Appointment";

const { getyByText } = render(<Application />);

afterEach(cleanup);

describe("Application", () => {


  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"));
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointments, "Add"));

    fireEvent.change(getByPlaceholderText(appointments, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointments, "Sylvia Palmer"));

    fireEvent.click(getByText(appointments, "Save"));

    let monday = await waitForElement(() => getAllByTestId(container, "day").find(day => queryByText(day, "Monday")));
    expect(getByText(monday, /no spots remaining/i)).toBeInTheDocument();

  });


  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    let appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 4. Check that edit mode is shown.
    await waitForElement(() => getByDisplayValue(appointment, "Archie Cohen"));
    // 5. Click the "Save" button.
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 7. Wait until the saved element  is displayed.
    await waitForElement(() => getByAltText(appointment, "Edit"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    let monday = await waitForElement(() => getAllByTestId(container, "day").find(day => queryByText(day, "Monday")));
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    let appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));
    await waitForElement(() => getByDisplayValue(appointment, "Archie Cohen"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Failed to save"));
    expect(getByText(appointment, "Failed to save")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => { 
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));
    await waitForElement(() => queryByText(appointment, "Delete the appointment?"));
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Failed to delete"));
    expect(getByText(appointment, "Failed to delete")).toBeInTheDocument();
  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    await waitForElement(() => queryByText(appointment, "Delete the appointment?"));
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    let monday = await waitForElement(() => getAllByTestId(container, "day").find(day => queryByText(day, "Monday")));
    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
  });

});
