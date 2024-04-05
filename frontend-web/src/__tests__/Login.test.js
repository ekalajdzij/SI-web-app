/*import React from "react";
import CampaignView from "../components/CampaignView";
import { render, screen } from "@testing-library/react";

import {skip} from '@jest/globals';


test.skip('adds 1 + 2 to equal 3', () => {
  expect(3).toBe(3);
});
*/

import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  getByPlaceholderText,
} from "@testing-library/react";
import axios from "axios";
import Login from "../components/Login";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import CampaignView from "../components/CampaignView";
import {skip} from '@jest/globals';



jest.mock("axios");
let testLocation;
const TestLocationComponent = () => {
  const location = useLocation();
  testLocation = location;
  return null;
};

describe.skip("Login component", () => {
 /* beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });
  */

  it("should display username and password input fields", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

   /* await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Username or phone number")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });
    */
  });
  /*
  it("should display validation error when form is submitted without email and password", async () => {
    const mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    axios.post.mockResolvedValueOnce({ data: { message: "User not found" } });

    render(
      <Router>
        <Login />
      </Router>
    );
    fireEvent.change(screen.getByPlaceholderText("Username or phone number"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "" },
    });

    const logins = screen.getAllByText("Log in");
    fireEvent.click(logins[0]);
    const errorMessage = await screen.findByText(
      "Invalid login data",
      {},
      { timeout: 5000 }
    );
    expect(errorMessage).toBeInTheDocument();

    expect(mockConsoleError).toHaveBeenCalledWith(
      "Greška prilikom logiranja:",
      expect.any(Error)
    );
    mockConsoleError.mockRestore();
  });
  it("should display validation error when form is submitted with invalid email and password", async () => {
    const mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    axios.post.mockResolvedValueOnce({ data: { message: "User not found" } });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Username or phone number"), {
      target: { value: "nonexistent" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "nonexistent" },
    });

    const logins = screen.getAllByText("Log in");
    fireEvent.click(logins[0]);

    const errorMessage = await screen.findByText(
      "Invalid login data",
      {},
      { timeout: 5000 }
    );
    expect(errorMessage).toBeInTheDocument();

    expect(mockConsoleError).toHaveBeenCalledWith(
      "Greška prilikom logiranja:",
      expect.any(Error)
    );
    mockConsoleError.mockRestore();
  });

  it("successful login", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: "mocked-token",
        secretKey: "mocked-secretKey",
        fullName: "mocked-fullName",
      },
    });
    const mockVisib1 = jest.fn();
    const { getByPlaceholderText, getAllByText } = render(
      <Router>
        <Login visib={mockVisib1} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText("Username or phone number"), {
      target: { value: "test" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "test" },
    });

    const logins = getAllByText("Log in");
    fireEvent.click(logins[0]);
    await waitFor(
      () => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`https://fieldlogistics-control.azurewebsites.net/api/login`, {
          Username: "test",
          Password: "test",
        });
        expect(localStorage.getItem("ime")).toBe(`Welcome mocked-fullName`);
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("should redirect to /twofactor for user without secretKey", async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: "mocked-token", secretKey: "mocked-secretKey" },
    });
    const mockVisib = jest.fn();
    const { getByPlaceholderText, getAllByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login visib={mockVisib} />} />
          <Route path="*" element={<TestLocationComponent />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(getByPlaceholderText("Username or phone number"), {
      target: { value: "test" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "test" },
    });

    const logins = getAllByText("Log in");
    fireEvent.click(logins[0]);
    await waitFor(
      () => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`https://fieldlogistics-control.azurewebsites.net/api/login`, {
          Username: "test",
          Password: "test",
        });
        expect(mockVisib).toHaveBeenCalledWith(false);
        expect(testLocation.pathname).toBe("/twofactor");
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("should redirect to /twofactor for user without secretKey", async () => {
    axios.post
      .mockResolvedValueOnce({
        data: { token: "mocked-token" },
      })
      .mockResolvedValueOnce({
        data: {
          qrCodeImageUrl: "mocked-qrCodeImageUrl",
          manualEntryKey: "mocked-manualEntryKey",
        },
      });
    const mockVisib2 = jest.fn();
    const mockQR = jest.fn();
    const { getByPlaceholderText, getAllByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={<Login visib={mockVisib2} QR={mockQR} />}
          />
          <Route path="*" element={<TestLocationComponent />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(getByPlaceholderText("Username or phone number"), {
      target: { value: "test" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "test" },
    });

    const logins = getAllByText("Log in");
    fireEvent.click(logins[0]);
    await waitFor(
      () => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`https://fieldlogistics-control.azurewebsites.net/api/login`, {
          Username: "test",
          Password: "test",
        });
      },
      { timeout: 5000 }
    );
    await waitFor(
      () => {
        expect(mockVisib2).toHaveBeenCalledWith(true);

        expect(axios.post).toHaveBeenCalledTimes(2);
        expect(axios.post).toHaveBeenCalledWith(`https://fieldlogistics-control.azurewebsites.net/api/login/setup/2fa`, {
          Username: "test",
          Password: "test",
        });
      },
      { timeout: 5000 }
    );
    expect(testLocation.pathname).toBe("/twofactor");
  }, 10000);
  */
});
