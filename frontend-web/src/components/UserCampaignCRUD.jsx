import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import axios from 'axios';
function UserCampaignCRUD() {
    const [userData, setUserData] = useState([]);
    const [selectedList, setSelect] = useState([]);

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
        if(localStorage.getItem('selectList')){
            setSelect(JSON.parse(localStorage.getItem('selectList')))
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
                `http://localhost:5200/api/user/campaigns/${id}`,
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

    const handleSave = async (id) => {
      //  console.log(localStorage.getItem('campId'))
       // console.log(selectedUser);
        let x = selectedUser;
        //console.log(selectedList);
       
        
        if (x == '') {
            //console.log("uslo");
            //console.log(selectedList[0].id);
            x = JSON.stringify(selectedList[0].id);
        }
        let newUsername=selectedList.find(user=>user.id==x);
      

        const objectToUpdate = {
            userId: x,
            campaignId: localStorage.getItem('campId'),
            status: "none",
            workingStatus:"none"

        }
        
       

        //console.log(objectToUpdate)
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://localhost:5200/api/user/campaigns/${editableRow}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify(objectToUpdate
                )
            });
            //console.log(response);
            localStorage.setItem("accessToken", [...response.headers][0][1]);
            const updatedList=userData.map(user=>{
                if(user.id==editableRow){
                    return{...user, userId:newUsername.id, username:newUsername.username}
                }
                return user;
            })
            setUserData(updatedList);
            localStorage.setItem('userForCampaign',JSON.stringify(updatedList));

           
           

        } catch (error) {
            console.error('Error updating campaign status:', error.message);
            throw error;
        }

        try {
            const id=parseInt(localStorage.getItem('campId'))
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `http://localhost:5200/api/user/campaigns/${id}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
    
            if (response.headers.authorization) {
                localStorage.setItem("accessToken", response.headers.authorization);
            }
            localStorage.setItem('userForCampaign',JSON.stringify(response.data)); 
            setUserData(response.data);     
    
            const userIds = response.data.map(u=>u.userId);
            //console.log(response.data); 
            //console.log(userIds);
            if(localStorage.getItem('company') && localStorage.getItem('userData')){
    
            const filteredUsers=JSON.parse(localStorage.getItem('userData')).filter(u=>u.companyId==localStorage.getItem('company'));
            const finalFilteredUsers = filteredUsers.filter(user => !userIds.includes(user.id));
            localStorage.setItem('selectList',JSON.stringify(finalFilteredUsers));
            setSelect(finalFilteredUsers);
            localStorage.setItem('campId',id)
    
          }
          
        } catch (error) {
            console.error("There was a problem with fetching company data:", error);
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
                                        {selectedList.map((item) => (
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
