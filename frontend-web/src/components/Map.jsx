import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindowF,
} from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import "../css/map.css";
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: "1000px",
  height: "500px",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
function Map({ setGoBack }) {
  const pdfref = useRef();
  const downloadPDF = () => {
    const input = pdfref.current;
    html2canvas(input, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgh = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgh);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgh * ratio);

      pdf.save("CampaignMap.pdf");
    });
  };

  const [recordsData, setRecord] = useState(
    JSON.parse(localStorage.getItem("records"))
  );
  const [location, setLoc] = useState(null);
  const [flag, setFlag] = useState(false);
  const [width, setWidth] = useState(0);

  const [height, setHeight] = useState(0);

  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  const [map, setMap] = useState(null);
  const [address, setAddress] = useState();

  const [center, setCenter] = useState({ lat: 48.8566, lng: 2.3522 });

  const onMapLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const handleRecordData = async (id) => {
    setGoBack(true);
    if (
      localStorage.getItem("locations") !== undefined &&
      localStorage.getItem("locations") !== null &&
      localStorage.getItem("campaignName") !== "undefined" &&
      localStorage.getItem("campaignName") !== "null"
    ) {
      const locations = JSON.parse(localStorage.getItem("locations"));
      //console.log("Opp")
      //console.log(locations);

      localStorage.setItem(
        "locationName",
        JSON.stringify(locations.find((location) => location.id === id))
      );
      //console.log(id);
      //console.log(locations.find((l) => l.id === id));
      //console.log(localStorage.getItem("locationName"));
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:5200/api/location/record/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.headers.authorization) {
        localStorage.setItem("accessToken", response.headers.authorization);
      }

      localStorage.setItem("recordData", JSON.stringify(response.data));
      //console.log(response)
      //console.log(localStorage.getItem("recordData"));
      localStorage.setItem("previousRoute", "/map");
      navigate("/record");
    } catch (error) {
      console.error("There was a problem with fetching company data:", error);
    }
  };

  /*const getDirections = async (origin, destination) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=AIzaSyAnoTrrumleEp9aG0CudXZPdHdey1Fn3R0`);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const steps = data.routes[0].legs[0].steps;
        const directions = steps.map(step => step.html_instructions);
        return directions;
      } else {
        return "No directions found";
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      return null;
    }
  };
  
  // Example usage:
  const origin = "New York, NY";
  const destination = "Los Angeles, CA";
  
  /*getDirections(origin, destination)
    .then(directions => {
      console.log("Directions:", directions);
    })
    .catch(error => {
      console.error("Error:", error);
    });*/

  const onAddressSubmit = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${googleMapsApiKey}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setCenter({ lat: location.lat, lng: location.lng });
      } else {
        console.log("Address not found");
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };
  const setSelectedLocationHover = (id, cord1, cord2) => {
    if (id !== null) {
      setFlag(true);
      if (
        localStorage.getItem("locations") !== undefined &&
        localStorage.getItem("locations") !== null &&
        localStorage.getItem("campaignName") !== "undefined" &&
        localStorage.getItem("campaignName") !== "null"
      ) {
        const locations = JSON.parse(localStorage.getItem("locations"));
        setLoc(locations.find((location) => location.id === id));
      }
      setWidth(cord1);
      setHeight(cord2);
      //console.log(location,width,height)
    } else {
      setFlag(false);
      setLoc(null);
    }
  };
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;
  return (
    <>
      <img
        src="./blue-back.png"
        alt="Back"
        className="backIcon"
        onClick={() => {
          navigate("/campaign");
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        ref={pdfref}
      >
        {recordsData.length ? (
          <React.Fragment>
            <h2
              id="title"
              style={{ color: "black" }}
              onClick={() => downloadPDF()}
            >
              Locations for {localStorage.getItem("campaignName")}
            </h2>
            {/* <input
            id='search'
            type="text"
            placeholder="Enter address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <button onClick={() => onAddressSubmit(address)}>Submit</button> */}
            <GoogleMap
              zoom={5}
              center={center}
              mapContainerStyle={mapContainerStyle}
              onLoad={onMapLoad}
            >
              {recordsData.map((item, index) => (
                <MarkerF
                  key={index}
                  position={{
                    lat: Number(item.coordinates.split(", ")[0]),
                    lng: Number(item.coordinates.split(", ")[1]),
                  }}
                  onClick={() => handleRecordData(parseInt(item.locationId))}
                  onRightClick={() =>
                    setSelectedLocationHover(
                      item.locationId,
                      Number(item.coordinates.split(", ")[0]),
                      Number(item.coordinates.split(", ")[1])
                    )
                  }
                />
              ))}
              {flag && location && (
                <InfoWindowF
                  position={{
                    lat: width,
                    lng: height,
                  }}
                  onCloseClick={() =>
                    setSelectedLocationHover(null, null, null)
                  }
                >
                  <div>
                    <h3>{location.typeOfLocation}</h3>
                    <p>{location.description}</p>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          </React.Fragment>
        ) : (
          <h2 style={{ color: "black", marginTop: "50px" }}>
            No locations for this campaign
          </h2>
        )}
      </div>
    </>
  );
}

export default Map;
