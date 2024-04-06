import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import axios from 'axios';
function UserCampaignCRUD() {
    const [userData, setUserData] = useState([]);
    const [name, setName] = useState("");
    const [editableRow, setEditableRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    //console.log(JSON.parse(localStorage.getItem('selectList')));

    useEffect(() => {
        // Učitavanje podataka iz localStorage-a kada se komponenta mounta
        const userDataFromStorage = JSON.parse(localStorage.getItem('userForCampaign'));
        if (userDataFromStorage) {
            setUserData(userDataFromStorage);
            if (localStorage.getItem('campaignData') && localStorage.getItem('campId'))

                setName(JSON.parse(localStorage.getItem('campaignData')).find((destinacija) => destinacija.id == localStorage.getItem('campId'))?.name);
        }

    }, []);

    const handleEdit = (id) => {
        setSelectedUser("");
        setEditableRow(id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(
                `https://fieldlogistics-control.azurewebsites.net/api/user/campaigns/${id}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            ).then(response => {
                localStorage.setItem("accessToken", response.headers.authorization);

            });
            const updatedUs = userData.filter((u) => u.id !== id);
            setUserData(updatedUs);
            localStorage.setItem("userForCampaign", JSON.stringify(updatedUs));
        } catch (error) {
            console.error("Error deleting company:", error);
        }
    };

    const handleSave = (id) => {
        console.log(localStorage.getItem('campId'))
        console.log(selectedUser);
        let x = selectedUser;
        if (x == '') {
            //console.log("uslo");
            console.log(userData[0].userId);
            x = JSON.stringify(userData[0].userId);
        }

        const objectToUpdate = {
            Id: id,
            UserId: x,
            CampaignId: localStorage.getItem('campId'),
            Status: "none",
            LocationId: null

        }
        console.log(objectToUpdate)
        try {
            const token = localStorage.getItem("accessToken");
            const response = fetch(`https://fieldlogistics-control.azurewebsites.net/api/user/campaigns/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify(objectToUpdate
                )
            });
            console.log(response);


        } catch (error) {
            console.error('Error updating campaign status:', error.message);
            throw error;
        }

        setIsEditing(false);
        setEditableRow(null);
    };
    const handleSelectChange = (event) => {
        // const name = userData.find(obj => obj.id == event.target.value)?.userId;
        setSelectedUser(event.target.value);
    };

    return (
        <div>
            <h2 style={{ marginTop: '10px', textAlign: 'center', color: 'black' }}>Assigned users for {name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user, index) => (
                        <tr key={index}>
                            <td>
                                {editableRow === user.id && isEditing ? (
                                    <select value={selectedUser ?? "Select user"} onChange={handleSelectChange}>
                                        {JSON.parse(localStorage.getItem('selectList')).map((item) => (
                                            <option key={item.id} value={item.id}>{item.username}</option>
                                        ))}
                                    </select>
                                ) : (
                                    user.username
                                )}
                            </td>
                            <td>{user.status}</td>
                            <td>
                                {user.status === 'none' && (
                                    <>
                                        {editableRow === user.id && isEditing ? (<>
                                            <FaCheck className="companyUpdateIcon"
                                                onClick={() => handleSave(user.id)} />
                                            <FaTimes className="companyDeleteIcon"
                                                onClick={() => setEditableRow(null)} /></>
                                        ) : (
                                            <FaEdit className="companyUpdateIcon"
                                                onClick={() => handleEdit(user.id)} />
                                        )}
                                    </>
                                )}
                                <FaTrash className="companyDeleteIcon"
                                    onClick={() => handleDelete(user.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserCampaignCRUD;
