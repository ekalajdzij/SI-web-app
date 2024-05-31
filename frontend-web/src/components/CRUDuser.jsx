import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import "../css/CRUDuser.css";
import axios from "axios";

function CRUDuser() {
  const [userData, setUserData] = useState([]);
  const [companyName, setCompName] = useState(
    localStorage.getItem("companyName")
  );
  const [company, setCompId] = useState(localStorage.getItem("company"));
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [passwordChanged, setPasswordChanged] = useState(false);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    Username: "",
    Password: "",
    PhoneNumber: "",
    FullName: "",
    Mail: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://fieldlogistics-control.azurewebsites.net/api/user",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.data) {
          localStorage.setItem("accessToken", response.headers.authorization);
          const data = response.data;
          setUserData(data);
          localStorage.setItem("userData", JSON.stringify(data));

        }
      } catch (error) {
        console.error("There was a problem with fetching company data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `https://fieldlogistics-control.azurewebsites.net/api/user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      localStorage.setItem("accessToken", [...response.headers][0][1]);
      if (response.ok) {
        const updatedUsers = userData.filter((user) => user.id !== id);
        setUserData(updatedUsers);
        localStorage.setItem("userData", JSON.stringify(updatedUsers));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleInputChangeAdd = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleEditClick = (id) => {
    const foundUser = userData.find((user) => user.id === id);
    setEditableRow(id);
    setEditedData({
      ...editedData,
      [id]: {
        ...foundUser,
      },
    });
  };

  const handleConfirmEdit = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const userToUpdate = editedData[id];

      if (passwordChanged) {
        const encoder = new TextEncoder();
        const data = encoder.encode(userToUpdate.password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        userToUpdate.password = hashHex;
      }
      //console.log(userToUpdate);

      const response = await fetch(
        `https://fieldlogistics-control.azurewebsites.net/api/user/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToUpdate),
        }
      );

      localStorage.setItem("accessToken", [...response.headers][0][1]);

      if (!response.ok) {
        throw new Error("Problem sa ažuriranjem korisnika");
      }

      const updatedUsers = userData.map((user) =>
        user.id === id ? editedData[id] : user
      );
      setUserData(updatedUsers);
      localStorage.setItem("userData", JSON.stringify(updatedUsers));
      setEditableRow(null);
      setPasswordChanged(false);
    } catch (error) {
      console.error("Greška prilikom ažuriranja korisnika:", error);
    }
  };

  const handleInputChange = (e, field, id) => {
    const value = e.target.value;
    if (field === "Password" || field == "password") {
      setPasswordChanged(true);
    }
    setEditedData({
      ...editedData,
      [id]: {
        ...editedData[id],
        [field]: value,
      },
    });
  };

  function hasEmptyFields(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (hasEmptyFields(obj[key])) {
          return true;
        }
      } else if (obj[key] === '') {
        return true;
      }
    }
    return false;
  }

  const handleAddUser = async () => {
    if(hasEmptyFields(newUser)){
      alert('All fields have to be filled');
      return;
    }
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(newUser.Password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "https://fieldlogistics-control.azurewebsites.net/api/user",
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newUser,
            Password: hashHex,
            CompanyId: company,
            SecretKey: "",
            Token: null,
          }),
        }
      );
      
      if (!response.ok) {
        
        const errorText = await response.text();
        console.error("Error adding user:", response.status, response.statusText, errorText);
        alert(`Error adding user: user with this username or phone number already exist`);
        return; 
      }

      else {
        localStorage.setItem("accessToken", [...response.headers][0][1]);

        const addedUser = await response.json();
        //console.log(addedUser);
        let currentUserData =
          JSON.parse(localStorage.getItem("userData")) || [];

        setUserData((prevUserData) => [...prevUserData, addedUser]);
        currentUserData.push(addedUser);
        localStorage.setItem("userData", JSON.stringify(currentUserData));
        setIsAddingUser(false);
        setNewUser({
          Username: "",
          Password: "",
          PhoneNumber: "",
          FullName: "",
          Mail: "",
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div>
      <div id="main">
        <h2 id="title">User data for your company - {companyName}</h2>
        <button onClick={() => setIsAddingUser(true)}>Add User</button>
      </div>
      {isAddingUser && (
        <div className="modal" id="addUser">
          <input
            type="text"
            name="Username"
            value={newUser.Username}
            onChange={handleInputChangeAdd}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="Password"
            value={newUser.Password}
            onChange={handleInputChangeAdd}
            placeholder="Password"
            required
          />
          <input
            type="text"
            name="PhoneNumber"
            value={newUser.PhoneNumber}
            onChange={handleInputChangeAdd}
            placeholder="Phone Number"
            required
          />
          <input
            type="text"
            name="FullName"
            value={newUser.FullName}
            onChange={handleInputChangeAdd}
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            name="Mail"
            value={newUser.Mail}
            onChange={handleInputChangeAdd}
            placeholder="Mail"
            required
          />
          <button onClick={handleAddUser}>Create</button>
          <button
            className="cancelButton"
            onClick={() => setIsAddingUser(false)}
          >
            Cancel
          </button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Phone Number</th>
            <th>Mail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData
            .filter((user) => user.companyId == company)
            .map((user) => (
              <tr key={user.id}>
                <td>
                  {editableRow === user.id ? (
                    <input
                      type="text"
                      value={editedData[user.id]?.fullName ?? user.fullName}
                      onChange={(e) =>
                        handleInputChange(e, "fullName", user.id)
                      }
                    />
                  ) : (
                    user.fullName
                  )}
                </td>
                <td>
                  {editableRow === user.id ? (
                    <input
                      type="text"
                      value={editedData[user.id]?.username ?? user.username}
                      onChange={(e) =>
                        handleInputChange(e, "username", user.id)
                      }
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editableRow === user.id ? (
                    <input
                      type="password"
                      value={editedData[user.id]?.password ?? "XXXXXX"}
                      onChange={(e) =>
                        handleInputChange(e, "password", user.id)
                      }
                    />
                  ) : (
                    "XXXXXX"
                  )}
                </td>
                <td>
                  {editableRow === user.id ? (
                    <input
                      type="text"
                      value={
                        editedData[user.id]?.phoneNumber ?? user.phoneNumber
                      }
                      onChange={(e) =>
                        handleInputChange(e, "phoneNumber", user.id)
                      }
                    />
                  ) : (
                    user.phoneNumber
                  )}
                </td>
                <td>
                  {editableRow === user.id ? (
                    <input
                      type="text"
                      value={editedData[user.id]?.mail ?? user.mail}
                      onChange={(e) => handleInputChange(e, "mail", user.id)}
                    />
                  ) : (
                    user.mail
                  )}
                </td>
                <td className="actions-column">
                  {editableRow === user.id ? (
                    <FaCheck
                      onClick={() => handleConfirmEdit(user.id)}
                      className="confirmEditBtn"
                    />
                  ) : (
                    <FaEdit
                      onClick={() => handleEditClick(user.id)}
                      className="editBtn"
                    />
                  )}
                  <FaTrash
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-icon"
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
