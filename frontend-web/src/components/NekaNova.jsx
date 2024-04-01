import React, { useEffect, useState } from 'react';

function NekaNova() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log(userData)
  setUsers(userData)
  }, []);

  const handleSelectChange = (e) => {
    setSelectedUser(e.target.value);
  };

  return (
    <div>
      <h2>List of Users</h2>
      <select value={selectedUser} onChange={handleSelectChange}>
        <option value=''>Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>
    </div>
  );
}

export default NekaNova;
