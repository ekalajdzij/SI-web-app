import React from "react";
import Home from "../components/Home";
import { fireEvent, logRoles, render, screen } from "@testing-library/react";
import { BrowserRouter as Router,  Routes,  Route} from "react-router-dom"
import {skip} from '@jest/globals';
import '@testing-library/jest-dom'



describe('Records component', () => {

    beforeEach(() => {
        render(<Home />);
    });
  
    it('Home component should display', async () => {
        const element = screen.getByTestId("GeneralLocationsDiv");
        expect(element).toBeInTheDocument();
    });

    it('Home component should display admin info container', async () => {
        const element = screen.getByTestId("AdminInfoDiv");
        expect(element).toBeInTheDocument();
    });
    
    it('Home component should display welcome message to admin', async () => {
        const element = screen.getByText(/Welcome back/i);
        expect(element.innerHTML).toBe("Welcome back");
    });

    it('Home component should display admin campaign status', async () => {
        const element = screen.getByText(/You are the administrator of/i);
        expect(element.innerHTML).toBe("You are the administrator of <strong></strong>");
    });

    it('Home component should display mesage of empty records', async () => {
        const element = screen.getByText(/No records for this campaign/i);
        expect(element.innerHTML).toBe("No records for this campaign");
    });   

    it.skip('Home component renders welcome message for superadmin', () => {
        window.localStorage.getItem = jest.fn(() => 'superadmin');
        render(<Home />);
        expect(screen.getByText('Welcome Mock User you are signed in as superadministrator')).toBeInTheDocument();
    });
      
});
