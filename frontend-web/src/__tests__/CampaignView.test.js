import React from "react";
import CampaignView from "../components/CampaignView";
import { fireEvent, render, screen } from "@testing-library/react";
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom"
import {skip} from '@jest/globals';
import '@testing-library/jest-dom'


describe('CompaignView component', () => {
  beforeEach(() => {
    render(
      <Router>
        <CampaignView />
      </Router>
    );
  });

  it('CampaignView UI elements should be display', async () => {

    const componentWrapper = screen.getByTestId("ID1");
    const title = screen.getByText(/Campaigns for/i);
    const btnAddCampaign = screen.getAllByRole("button")[0];
  
    expect(componentWrapper).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(btnAddCampaign).toBeInTheDocument();
    expect(btnAddCampaign.innerHTML).toBe('Add Campaign');

  });


  it('Adding Campaign button should display form for adding Campaign', async () => {

    const btnAddCampaign = screen.getAllByRole("button")[0];  
    expect(btnAddCampaign).toBeInTheDocument();
  
    //Klik na btn
    fireEvent.click(btnAddCampaign);
  
    const modal = screen.getByTestId("formForAddingCampaign");
    expect(modal).toBeInTheDocument();  

  });


  it('Input fields in form for adding Campaign should be empty', async () => {

    const btnAddCampaign = screen.getAllByRole("button")[0];  
    expect(btnAddCampaign).toBeInTheDocument();
  
    //Klik na btn za otvaranje foreme
    fireEvent.click(btnAddCampaign);

    const inputNameField = screen.getByPlaceholderText(/name/i)
    const inputDescriptionField = screen.getByPlaceholderText(/description/i)
    const inputStartDateField = screen.getByPlaceholderText(/start date/i)
    const inputEndDateField = screen.getByPlaceholderText(/end date/i)

    expect(inputNameField).toBeInTheDocument();
    expect(inputNameField.value).toBe("");

    expect(inputDescriptionField).toBeInTheDocument();
    expect(inputDescriptionField.value).toBe("");

    expect(inputStartDateField).toBeInTheDocument();
    expect(inputStartDateField.value).toBe("");

    expect(inputEndDateField).toBeInTheDocument();
    expect(inputEndDateField.value).toBe(""); 
      
  });


  it('Testing form to add new campaign', async () => {
    
    const btnAddCampaign = screen.getAllByRole("button")[0];  
    expect(btnAddCampaign).toBeInTheDocument();
  
    //Klik na btn za otvaranje foreme
    fireEvent.click(btnAddCampaign);

    const inputNameField = screen.getByPlaceholderText(/name/i)
    const inputDescriptionField = screen.getByPlaceholderText(/description/i)
    const inputStartDateField = screen.getByPlaceholderText(/start date/i)
    const inputEndDateField = screen.getByPlaceholderText(/end date/i)

    expect(inputNameField).toBeInTheDocument();
    fireEvent.change(inputNameField, { target: { value: 'Test Campaign' } });
    expect(inputNameField.value).toBe("Test Campaign");

    expect(inputDescriptionField).toBeInTheDocument();
    fireEvent.change(inputDescriptionField, { target: { value: 'Test Destination' } });
    expect(inputDescriptionField.value).toBe("Test Destination");

    expect(inputStartDateField).toBeInTheDocument();
    expect(inputEndDateField).toBeInTheDocument();

    const submitBtn = screen.getByTestId("submitCampaignForm");  
    expect(submitBtn).toBeInTheDocument();
  
    //Klik na btn
    fireEvent.click(submitBtn);
      
  });


});



