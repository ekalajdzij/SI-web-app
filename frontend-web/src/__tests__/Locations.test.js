import React from "react";
import Locations from "../components/Locations";
import { fireEvent, render, screen } from "@testing-library/react";
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom"
import {skip} from '@jest/globals';
import '@testing-library/jest-dom'


describe('Locations component', () => {

  beforeEach(() => {
    render(
      <Router>
        <Locations />
      </Router>
    );
  });


  it('Locations header and table should be display', async () => {

    const tableHeader = screen.getByText(/Location Data/i);
    const tableOfLocations = screen.getAllByRole("table")[0];
    
    expect(tableHeader).toBeInTheDocument();
    expect(tableHeader.innerHTML).toBe('Location data for ')
    expect(tableOfLocations).toBeInTheDocument();
    
  });

  it('Header of table with locations should have defined labels', async () => {

    const locationLable = screen.getByText(/Type of Location/i);
    const addressLable = screen.getByText(/Address/i);
    const contactNumberLable = screen.getByText(/Contact Number/i);
    const descriptionLable = screen.getByText(/Description/i);
    const actionsLable = screen.getByText(/Actions/i);
    
    expect(locationLable).toBeInTheDocument();
    expect(locationLable.innerHTML).toBe('Type of Location');

    expect(addressLable).toBeInTheDocument();
    expect(addressLable.innerHTML).toBe('Address');
    
    expect(contactNumberLable).toBeInTheDocument();
    expect(contactNumberLable.innerHTML).toBe('Contact Number');

    expect(descriptionLable).toBeInTheDocument();
    expect(descriptionLable.innerHTML).toBe('Description');

    expect(actionsLable).toBeInTheDocument();
    expect(actionsLable.innerHTML).toBe('Actions');
  });


});
