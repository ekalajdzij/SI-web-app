import React, { useEffect, useState } from 'react';
import "../css/records.css";

function Records() {
  const [recordData, setRecordData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('recordData'));
    if (storedData) {
      setRecordData(storedData);
    }
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Records</h2>
      <div className="recordsContainer">
        {recordData.map((record, index) => (
          <div key={index} className="record">
            <p><strong>ID:</strong> {record.id}</p>
            <p><strong>Serial Number:</strong> {record.serialNumber}</p>
            <p><strong>Inventory Number:</strong> {record.inventoryNumber}</p>
            <p><strong>GPS Coordinates:</strong> {record.gpsCoordinates}</p>
            <p><strong>Full Address:</strong> {record.fullAddress}</p>
            <p><strong>Photo URL:</strong> {record.photoUrl}</p>
            <p><strong>Location ID:</strong> {record.locationId}</p>
            <p><strong>User ID:</strong> {record.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Records;
