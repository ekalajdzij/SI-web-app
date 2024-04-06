import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  getByPlaceholderText,
  getByText,
} from "@testing-library/react";
import axios from "axios";
import TwoFactorPortal from "../components/TwoFactorPortal";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

jest.mock("axios");
let testLocation;
const TestLocationComponent = () => {
  const location = useLocation();
  testLocation = location;
  return null;
};
const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
describe("TwoFactorPortal component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should handle 2FA login for user with secretKey", async () => {
    getItemSpy.mockImplementation((key) => {
      switch (key) {
        case "user":
          return "mockedUser";
        case "pass":
          return "mockedPass";
        case "accessToken":
          return "mockedAccessToken";
        default:
          return null;
      }
    });
    setItemSpy.mockImplementation(() => {});
    axios.post.mockResolvedValue({
      headers: {
        authorization: "mockedAuthorization",
      },
    });

    const { getByTestId, getByText } = render(
      <MemoryRouter initialEntries={["/twofactor"]}>
        <Routes>
          <Route
            path="/twofactor"
            element={<TwoFactorPortal qrcode="mockedQrCode" vis={false} />}
          />
          <Route path="*" element={<TestLocationComponent />} />
        </Routes>
      </MemoryRouter>
    );

    for (let i = 0; i < 6; i++) {
      const input = getByTestId(`digit-${i}`);
      fireEvent.change(input, { target: { value: "1" } });
    }

    expect(getByText("Welcome back")).toBeInTheDocument();

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    expect(axios.post).toHaveBeenCalledWith(
      `https://fieldlogistics-control.azurewebsites.net/api/login/authenticate/2fa?code=111111`,
      {
        Username: "mockedUser",
        Password: "mockedPass",
      },
      {
        headers: {
          Authorization: "Bearer mockedAccessToken",
        },
      }
    );

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "mockedAuthorization"
    );
    expect(localStorage.setItem).toHaveBeenCalledWith("isLoggedIn", "true");
    expect(localStorage.setItem).toHaveBeenCalledWith("isLoggedInVia2fa", true);
    expect(localStorage.setItem).toHaveBeenCalledWith("logged", false);
  });

  it("should handle 2FA login for user without secretKey", async () => {
    getItemSpy.mockImplementation((key) => {
      switch (key) {
        case "user":
          return "mockedUser";
        case "pass":
          return "mockedPass";
        case "accessToken":
          return "mockedAccessToken";
        case "logged":
          return "true";
        default:
          return null;
      }
    });
    setItemSpy.mockImplementation(() => {});
    axios.post.mockResolvedValue({
      headers: {
        authorization: "mockedAuthorization",
      },
    });

    const { getByTestId, getByText } = render(
      <MemoryRouter initialEntries={["/twofactor"]}>
        <Routes>
          <Route
            path="/twofactor"
            element={<TwoFactorPortal qrcode="mockedQrCode" vis={true} />}
          />
          <Route path="*" element={<TestLocationComponent />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByText("Set up Two-factor Authentication")).toBeInTheDocument();

    for (let i = 0; i < 6; i++) {
      const input = getByTestId(`digit-${i}`);
      fireEvent.change(input, { target: { value: "1" } });
    }

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    expect(axios.post).toHaveBeenCalledWith(
      `https://fieldlogistics-control.azurewebsites.net/api/login/authenticate/2fa?code=111111`,
      {
        Username: "mockedUser",
        Password: "mockedPass",
      },
      {
        headers: {
          Authorization: "Bearer mockedAccessToken",
        },
      }
    );

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "mockedAuthorization"
    );
    expect(localStorage.setItem).toHaveBeenCalledWith("isLoggedIn", "true");
    expect(localStorage.setItem).toHaveBeenCalledWith("isLoggedInVia2fa", true);
    expect(localStorage.setItem).toHaveBeenCalledWith("logged", false);
  });
});
