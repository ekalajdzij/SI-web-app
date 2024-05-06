import React, { useEffect, useState } from "react";
import "../css/records.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


function Records({ back }) {
  const navigate = useNavigate();
  const [recordData, setRecordData] = useState([]);
  const [location, setLocation] = useState([]);
  const [goBack, setGoback] = useState(back);

  const [campaignName, setCampaignName] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("recordData"));
    if (storedData) {
      setRecordData(storedData);
    }

    const locationName = localStorage.getItem("locationName");
    //console.log(locationName);
    if (locationName !== undefined && locationName !== null && locationName !== "undefined" && locationName !== "null") {
      //console.log("oo");
      setLocation(JSON.parse(locationName));
    }
    

    const campaignName = localStorage.getItem("campaignName");
    if (campaignName !== undefined && campaignName !== null && campaignName !== "undefined" && campaignName !== "null") {
      setCampaignName(campaignName);
    }
  }, []);
  function FormatirajKoordinate(koordinate) {
    const [prviBroj, drugiBroj] = koordinate.split(', ').map(Number);
    const prviSmjer = prviBroj >= 0 ? 'N' : 'S';
    const drugiSmjer = drugiBroj >= 0 ? 'E' : 'W';

    return `${Math.abs(prviBroj)}° ${prviSmjer}, ${Math.abs(drugiBroj)}° ${drugiSmjer}`;
  }

  return (
    <div className="container">
      {recordData.length ? (
        <React.Fragment>
          <h2 className="heading">
            Record for Location: {location.typeOfLocation}, within Campaign:{" "}
            {campaignName}
          </h2>
          <div className="recordsContainer">
            {recordData.map((record, index) => (
              <div key={index} className="record">
                <div>
                  <p>
                    <strong> Contact Number:</strong> {location.contactNumber}
                  </p>
                  <p>
                    <strong> Description:</strong> {location.description}
                  </p>
                  <p>
                    <strong>Serial Number:</strong> {record.serialNumber}
                  </p>
                  <p>
                    <strong>Inventory Number:</strong> {record.inventoryNumber}
                  </p>
                  <p>
                    <strong>GPS Coordinates:</strong> {FormatirajKoordinate(record.gpsCoordinates)}
                  </p>
                  <p>
                    <strong>Full Address:</strong> {record.fullAddress}
                  </p>
                </div>
                <div>
                  <img src={record.photoUrl}></img>
                </div>
                <button style={{
                  color: 'blue',
                  width: '10px',
                  padding: '5px',
                  marginBottom: 0,
                  fontSize: '26px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                }} onClick={() => { if (back) navigate('/map'); else navigate('/location') }}> <FontAwesomeIcon icon={faArrowLeft} /></button>
              </div>
            ))}
          </div>
        </React.Fragment>
      ) : (
        <div className="noRecordMessage">
          <h2 style={{ color: "black" }}>
            There is no record for this location
          </h2>
        </div>
      )}
    </div>
  );
}

export default Records;
