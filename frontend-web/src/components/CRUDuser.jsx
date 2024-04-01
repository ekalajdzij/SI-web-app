import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

function CRUDuser() {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData'))||null);
  const [companyName, setCompName] = useState(localStorage.getItem('companyName'));
  const [company, setCompId] = useState(localStorage.getItem('company'));

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    Username: '',
    Password: '',
    PhoneNumber: '',
    FullName: '',
    Mail: '',
  });

 

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('userData');
    if (userDataFromStorage) {
      const parsedUserData = JSON.parse(userDataFromStorage);
      setUserData(parsedUserData);
    }
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`https://fieldlogistics-control.azurewebsites.net/api/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedUsers = userData.filter(user => user.id !== id)
      setUserData(updatedUsers);
      localStorage.setItem('userData', JSON.stringify(updatedUsers));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddUser = async () => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(newUser.Password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const token = localStorage.getItem('accessToken');

      const response = await fetch('https://fieldlogistics-control.azurewebsites.net/api/user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          Password: hashHex,
          CompanyId: company,
          SecretKey: '',
          Token: null
        }),
      });

      if (response.ok) {
       
        const addedUser = await response.json();
        console.log(addedUser);
        let currentUserData = JSON.parse(localStorage.getItem('userData')) || [];

        setUserData(prevUserData => [...prevUserData, addedUser]);
        currentUserData.push(addedUser);
        localStorage.setItem('userData',JSON.stringify(currentUserData))
        setIsAddingUser(false);
        setNewUser({
          Username: '',
          Password: '',
          PhoneNumber: '',
          FullName: '',
          Mail: '',
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div>
      <h1>User data for your company - {companyName}</h1>
      <button onClick={() => setIsAddingUser(true)}>Add User</button>
      {isAddingUser && (
        <div className="modal" id='addUser'>
          <input
            type="text"
            name="Username"
            value={newUser.Username}
            onChange={handleInputChange}
            placeholder="Username"
          />
          <input 
            type="password"
            name="Password"
            value={newUser.Password}
            onChange={handleInputChange}
            placeholder="Password"
          />
          <input
            type="text"
            name="PhoneNumber"
            value={newUser.PhoneNumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
          <input
            type="text"
            name="FullName"
            value={newUser.FullName}
            onChange={handleInputChange}
            placeholder="Full Name"
          />
          <input
            type="text"
            name="Mail"
            value={newUser.Mail}
            onChange={handleInputChange}
            placeholder="Mail"
          />
          <button onClick={handleAddUser}>Create</button>
          <button onClick={() => setIsAddingUser(false)}>Cancel</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Phone Number</th>
            <th>ID</th>
            <th>Mail</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {userData.filter(user => user.companyId == company).map(user => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.username}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.id}</td>
              <td>{user.mail}</td>
              <td>
                <FaTrash
                  onClick={() => handleDeleteUser(user.id)}
                  style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CRUDuser;
