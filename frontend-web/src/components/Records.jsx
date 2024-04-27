import React, { useEffect, useState } from 'react';

function Records() {
  const [recordData, setRecordData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('recordData'));
    if (storedData) {
      setRecordData(storedData);
    }
  }, []);

  return (
    <div>
      <h2>Records</h2>
      <div>
        {recordData.map((record, index) => (
          <div key={index}>
            <p>ID: {record.id}</p>
            <p>Serial Number: {record.serialNumber}</p>
            <p>Inventory Number: {record.inventoryNumber}</p>
            <p>GPS Coordinates: {record.gpsCoordinates}</p>
            <p>Full Address: {record.fullAddress}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Records;
