import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Company from '../components/Company'; // Update the path if necessary

jest.mock('axios');

describe('Company Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a company', async () => {
    // Mock the response for fetching companies
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Company />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Companies')).toBeTruthy();
    });

    // Mock the response for adding a company
    const newCompany = { id: 1, name: 'New Company' };
    axios.post.mockResolvedValueOnce({ status: 201, data: newCompany });

    // Click on "Add Company" button
    fireEvent.click(screen.getByText('Add Company'));

    // Enter new company name
    fireEvent.change(screen.getByPlaceholderText('Enter new company name'), {
      target: { value: 'New Company' },
    });

    // Click on "Create" button
    fireEvent.click(screen.getByText('Create'));

    // Check if the new company is added to the list
    await waitFor(() => {
      expect(screen.getByText('New Company')).toBeTruthy();
    });
  });

  it('should edit a company', async () => {
    // Mock the response for fetching companies
    axios.get.mockResolvedValueOnce({ data: [] });
  
    render(<Company />);
  
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Companies')).toBeTruthy();
    });
  
    // Mock the response for adding a company
    const newCompany = { id: 111, name: 'New Company' };
    axios.post.mockResolvedValueOnce({ status: 201, data: newCompany });
  
    // Click on "Add Company" button
    fireEvent.click(screen.getByText('Add Company'));
  
    // Enter new company name
    fireEvent.change(screen.getByPlaceholderText('Enter new company name'), {
      target: { value: 'New Company' },
    });
  
    // Click on "Create" button
    fireEvent.click(screen.getByText('Create'));
  
    // Check if the new company is added to the list
    await waitFor(() => {
      expect(screen.getByText('New Company')).toBeTruthy();
    });
  
    // Mock the response for editing a company
    axios.put.mockResolvedValueOnce({});
  
    // Find the edit icon for the company
    const editIcon = screen.getByTestId('edit111');
  
    // Click on the edit icon
    fireEvent.click(editIcon);
  
    // Update company name
    fireEvent.change(screen.getByPlaceholderText('Update company name'), {
      target: { value: 'Updated Company' },
    });
    const confirmIcon = screen.getByTestId('confirm111');
  
    // Click on "Confirm" icon
    fireEvent.click(confirmIcon);
    // Check if the company name is updated
    await waitFor(() => {
      expect(screen.queryByText('New Company')).not.toBeTruthy(); // Ensure 'New Company' is no longer visible
      //expect(screen.queryByText('Updated Company')).toBeTruthy(); // Check if 'Updated Company' is visible
    });
  });  

  it('should delete a company', async () => {
    // Mock the response for fetching companies
    axios.get.mockResolvedValueOnce({ data: [] });
  
    render(<Company />);
  
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Companies')).toBeTruthy();
    });
  
    // Mock the response for adding a company
    const newCompany = { id: 111, name: 'New Company' };
    axios.post.mockResolvedValueOnce({ status: 201, data: newCompany });
  
    // Click on "Add Company" button
    fireEvent.click(screen.getByText('Add Company'));
  
    // Enter new company name
    fireEvent.change(screen.getByPlaceholderText('Enter new company name'), {
      target: { value: 'New Company' },
    });
  
    // Click on "Create" button
    fireEvent.click(screen.getByText('Create'));
  
    // Check if the new company is added to the list
    await waitFor(() => {
      expect(screen.getByText('New Company')).toBeTruthy();
    });
  
    // Mock the response for editing a company
    axios.put.mockResolvedValueOnce({});
  
    // Find the edit icon for the company
    const deleteIcon = screen.getByTestId('delete111');
  
    // Click on the edit icon
    fireEvent.click(deleteIcon);

    // Check if the company name is updated
    await waitFor(() => {
      expect(screen.queryByText('New Company')).not.toBeTruthy(); // Ensure 'New Company' is no longer visible
    });
  });  
});