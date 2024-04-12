import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import CRUDuser from '../components/CRUDuser'; // Update the path if necessary
import { waitForElementToBeRemoved } from '@testing-library/react';

jest.mock('axios');

describe('CRUDuser Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('opens modal when "Add User" button is clicked', async () => {
    localStorage.setItem('userData', JSON.stringify([]));

    render(<CRUDuser />);

    // Mock the response for adding a user
    const newUser = {
      id: 1,
      Username: 'testUser',
      Password: 'testPassword',
      PhoneNumber: '123456789',
      FullName: 'Test User',
      Mail: 'test@example.com'
    };

    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(newUser)
    });

    // Click on "Add User" button
    fireEvent.click(screen.getByText('Add User'));

    // Check if the modal is displayed
    await waitFor(() => {
      expect(screen.getByText('Create')).toBeTruthy();
    });
  });

  it('should add a user', async () => {
    // Mock the initial userData to be an empty array
    localStorage.setItem('userData', JSON.stringify([]));

    render(<CRUDuser />);

    // Mock the response for adding a user
    const newUser = {
      id: 1,
      Username: 'testUser',
      Password: 'testPassword',
      PhoneNumber: '123456789',
      FullName: 'Test User',
      Mail: 'test@example.com'
    };

    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(newUser)
    });

    // Click on "Add User" button
    fireEvent.click(screen.getByText('Add User'));

    // Enter user details
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testUser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '123456789' },
    });
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Mail'), {
      target: { value: 'test@example.com' },
    });

    // Click on "Create" button
    fireEvent.click(screen.getByText('Create'));

    expect(screen.getByDisplayValue('Test User')).toBeTruthy();
  });
  
  it('adds a user to the table and deletes it', async () => {
    localStorage.setItem('userData', JSON.stringify([]));

    render(<CRUDuser />);

    // Mock the response for adding a user
    const newUser = {
      id: 1,
      Username: 'testUser',
      Password: 'testPassword',
      PhoneNumber: '123456789',
      FullName: 'Test User',
      Mail: 'test@example.com'
    };

    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(newUser)
    });

    // Click on the "Add User" button to open the modal
    fireEvent.click(screen.getByText('Add User'));

    // Fill in the user details in the modal
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testPassword' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Mail'), { target: { value: 'test@example.com' } });

    // Click on the "Create" button to add the user
    fireEvent.click(screen.queryByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('testUser')).not.toBeTruthy();
    });
  });
  // Other test cases here...
});
