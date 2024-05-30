import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import axios from "axios";
import moment from "moment";

function Home({ isSuper }) {
  const [records, setRecords] = useState([]);
  const [sort, setSort] = useState(true); // true for ascending, false for descending

  const [ime, setIme] = useState(localStorage.getItem("ime") || null);
  const [flag, setFlag] = useState(
    JSON.parse(localStorage.getItem("isLoggedInVia2fa")) || false
  );
  useEffect(() => {
    localStorage.setItem("isLoggedInVia2fa", JSON.stringify(flag));
    localStorage.setItem("ime", ime);
  }, [flag, ime]);

  useEffect(() => {
    const campaigns = JSON.parse(localStorage.getItem("campaignData"));

    const fetchData = async () => {
      if (localStorage.getItem("homeScreen") === "admin") {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(
            `https://fieldlogistics-control.azurewebsites.net/api/location/company/record/${localStorage.getItem(
              "company"
            )}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          if (response.headers.authorization) {
            localStorage.setItem("accessToken", response.headers.authorization);
          }

          const data = response.data;
          //console.log(data);

          if (data.length) {
            const newData = data.map((item) => ({
              ...item,
              location: {
                ...item.location,
                companyName: campaigns.find(
                  (c) => c.id === item.location.campaignId
                ).name,
              },
            }));
            const updateDuration = () => {
              setRecords(
                newData
                  .map((item) => ({
                    ...item,
                    record: {
                      ...item.record,
                      duration: moment
                        .duration(moment().diff(moment(item.record.createdAt)))
                        .asMinutes(),
                    },
                  }))
                  .sort((a, b) =>
                    sort
                      ? a.record.duration - b.record.duration
                      : b.record.duration - a.record.duration
                  )
              );

              console.log(data,"ovdje");
            };

            updateDuration();
            /*if(!isSuper){
            const intervalId = setInterval(updateDuration, 20000); // Redovno ažuriranje svakih 20 sekundi

            return () => clearInterval(intervalId);}*/
          }
        } catch (error) {
          console.error(
            "There was a problem with fetching records data:",
            error
          );
        }
      }
    };
    fetchData();
  }, []);
  const updateRecords = (newData) => {
    const sortedData = newData.sort((a, b) =>
      sort
        ? a.record.duration - b.record.duration
        : b.record.duration - a.record.duration
    );
    setRecords(sortedData);
  };

  useEffect(() => {
    updateRecords([...records]);
  }, [sort]);

  function FormatirajKoordinate(koordinate) {
    const [prviBroj, drugiBroj] = koordinate.split(", ").map(Number);
    const prviSmjer = prviBroj >= 0 ? "N" : "S";
    const drugiSmjer = drugiBroj >= 0 ? "E" : "W";

    return `${Math.abs(prviBroj)}° ${prviSmjer}, ${Math.abs(
      drugiBroj
    )}° ${drugiSmjer}`;
  }
  function pretvoriMinuteUDaneSateMinute(minute) {
    const minuteUDanu = 60 * 24;
    const minuteUSatu = 60;

    const dani = Math.floor(minute / minuteUDanu);
    const sati = Math.floor((minute % minuteUDanu) / minuteUSatu);
    const preostaleMinute = Math.floor(minute % minuteUSatu);

    return `${dani} days ${Math.max(0,sati-2)} hours ${preostaleMinute} minutes ago`;
  }

  return (
    <div>
      {localStorage.getItem("homeScreen") === "superadmin" ? (
       <div id="admin-info-container" className="specific-container">
       <h1>Welcome back</h1>
       <img
         src="https://cdn-icons-png.freepik.com/512/9187/9187604.png"
         alt="user icon"
       />
       <strong id="user-name">{ime}</strong>
       <p>
         You are the super administrator 
       </p>
     </div>
      ) : (
        <>
          <div id="admin-info-container">
            <h1>Welcome back</h1>
            <img
              src="https://cdn-icons-png.freepik.com/512/9187/9187604.png"
              alt="user icon"
            />
            <strong id="user-name">{ime}</strong>
            <p>
              You are the administrator of{" "}
              <strong>{localStorage.getItem("companyName")}</strong>
            </p>
          </div>
       
            <div className="feed-container">
              <p id="feed-records">Records feed</p>
              {records.slice(0, 10).map((record) => (
                <div key={record.record.locationId} className="record-card">
                  <div className="record-details">
                    <div>
                      <p>
                        <strong>Description:</strong>{" "}
                        {record.location.description}
                      </p>
                      <p>
                        <strong>Type of Location:</strong>{" "}
                        {record.location.typeOfLocation}
                      </p>
                      <p>
                        <strong>Campaign:</strong> {record.location.companyName}
                      </p>
                      <p>
                        <strong>Contact:</strong>{" "}
                        {record.location.contactNumber}
                      </p>
                      <p>
                        <strong>Full Address:</strong>{" "}
                        {record.record.fullAddress}
                      </p>
                      <p>
                        <strong>GPS Coordinates:</strong>{" "}
                        {FormatirajKoordinate(record.record.gpsCoordinates)}
                      </p>
                      <p id="pointer" onClick={() => setSort(!sort)}>
                        <strong>Created :</strong>{" "}
                        {pretvoriMinuteUDaneSateMinute(record.record.duration)}
                      </p>
                    </div>

                    <img
                      src={record.record.photoUrl}
                      alt="Location"
                      className="record-image"
                    />
                  </div>
                </div>
              ))}
            </div>
         
        </>
      )}
    </div>
  );
}

export default Home;
