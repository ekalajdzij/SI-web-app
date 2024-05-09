import React from 'react';
import { render, fireEvent, waitFor, getByDisplayValue, screen } from '@testing-library/react';
import CRUDadmin from '../components/CRUDadmin';

jest.mock('axios');

describe('CRUDadmin Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('adds a new admin and deletes it', async () => {
    // Render the component
    const { getByText, getByPlaceholderText, getByTestId, queryByText } = render(<CRUDadmin />);

    // Click on the "Add Admin" button to open the modal
    fireEvent.click(getByText('Add Admin'));

    // Fill in the details for the new admin
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'newAdmin' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'newPassword' } });
    fireEvent.change(getByPlaceholderText('PhoneNumber'), { target: { value: '123456789' } });

    // Click on the "Create" button to add the admin
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the admin to appear in the table
    await waitFor(() => {
      expect(screen.getByDisplayValue('newAdmin')).toBeTruthy();
    });
  });
});
