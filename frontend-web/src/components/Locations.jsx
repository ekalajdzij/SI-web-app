import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

function LocationTable() {
    const [locations, setLocations] = useState([]);
    const [editableIndex, setEditableIndex] = useState(null);
    const [editedLocation, setEditedLocation] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [name,setName]=useState("");

    useEffect(() => {
        const locationsData = localStorage.getItem('locations');
        if (locationsData!==undefined && locationsData!==null) {
            setLocations(JSON.parse(locationsData));
        }
        if(localStorage.getItem('locationName')!==undefined && localStorage.getItem('locationName')!==null ){
            setName(localStorage.getItem('locationName'))
        }
    }, []);

    const handleEdit = (index) => {
        setEditableIndex(index);
        setEditedLocation(locations[index]);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
      try {
        const token = localStorage.getItem("accessToken");
  
        const response = await fetch(
          `https://fieldlogistics-control.azurewebsites.net/api/location/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        localStorage.setItem("accessToken", [...response.headers][0][1]);
        if (response.ok) {
          const updatedLocations = locations.filter(location => location.id !== id);
          setLocations(updatedLocations);
          localStorage.setItem('locations',JSON.stringify(updatedLocations));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    const handleSave = async (id) => {
        let x = editedLocation;
        console.log(x);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`https://fieldlogistics-control.azurewebsites.net/api/location/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify(x
                )
            });
            if (response.ok) {
                // Update the location in the state
                const updatedLocations = [...locations];
                const index = updatedLocations.findIndex(location => location.id === id);
                updatedLocations[index] = editedLocation;
                setLocations(updatedLocations);

                // Save updated locations to local storage
                localStorage.setItem('locations', JSON.stringify(updatedLocations));

                // Reset editing state
                setIsEditing(false);
                setEditableIndex(null);
            } else {
                console.error('Error updating location:', response.statusText);
            }

        } catch (error) {
            console.error('Error updating campaign status:', error.message);
            throw error;
        }
        console.log('Saving location with index', id);
        setIsEditing(false);
        setEditableIndex(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedLocation(prevLocation => ({
            ...prevLocation,
            [name]: value
        }));
    };

    return (
        <div>
            <h2 style={{ marginTop: '10px', textAlign: 'center', color: 'black' }}>Location data for {name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Type of Location</th>
                        <th>Address</th>
                        <th>Contact Number</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location, index) => (
                        <tr key={index}>
                            <td>{index === editableIndex && isEditing ? <input type="text" name="typeOfLocation" value={editedLocation.typeOfLocation} onChange={handleChange} /> : location.typeOfLocation}</td>
                            <td>{index === editableIndex && isEditing ? <input type="text" name="address" value={editedLocation.address} onChange={handleChange} /> : location.address}</td>
                            <td>{index === editableIndex && isEditing ? <input type="text" name="contactNumber" value={editedLocation.contactNumber} onChange={handleChange} /> : location.contactNumber}</td>
                            <td>{index === editableIndex && isEditing ? <input type="text" name="description" value={editedLocation.description} onChange={handleChange} /> : location.description}</td>
                            <td>
                                {index === editableIndex && isEditing ? (
                                    <>
                                        <FaCheck className="editIcon" onClick={() => handleSave(location.id)} style={{ marginRight: '5px', cursor: 'pointer' }} />
                                        <FaTimes className="deleteIcon" onClick={() => setIsEditing(false)} style={{ cursor: 'pointer' }} />
                                    </>
                                ) : (
                                    <>
                                        <FaEdit className="editIcon" onClick={() => handleEdit(index)} style={{ marginRight: '5px', cursor: 'pointer' }} />
                                        <FaTrash className="deleteIcon" onClick={() => handleDelete(location.id)} style={{ cursor: 'pointer', color: 'red' }} />
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LocationTable;
