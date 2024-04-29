import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../css/map.css";


const mapContainerStyle = {
  width: '1000px',
  height: '500px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  margin: '0 auto', 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', 
};
function Map() {
  const [recordsData, setRecord] = useState(JSON.parse(localStorage.getItem('records'))
  
    
  );

  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAnoTrrumleEp9aG0CudXZPdHdey1Fn3R0",
  });

  const [map, setMap] = useState(null);
  const [address, setAddress] = useState();

  const [center, setCenter] = useState({ lat: 48.8566, lng: 2.3522 });

  const onMapLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const handleRecordData = async (id) => {
    if(localStorage.getItem('locations')!=undefined && localStorage.getItem('locations')!=null)
    {const locations = JSON.parse(localStorage.getItem("locations"));

    
    localStorage.setItem('locationName',JSON.stringify(locations.find(location => location.id === id)));}

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://fieldlogistics-control.azurewebsites.net/api/location/record/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.headers.authorization) {
        localStorage.setItem("accessToken", response.headers.authorization);
      }
      
        localStorage.setItem('recordData', JSON.stringify(response.data));
        //console.log(response)
        console.log(localStorage.getItem('recordData'));
        navigate('/record');
      
        


    } catch (error) {
      console.error("There was a problem with fetching company data:", error);
    }
  }



  

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
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAnoTrrumleEp9aG0CudXZPdHdey1Fn3R0`);
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
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {recordsData.length ? (
        <React.Fragment>
          <h2 id='title' style={{ color: 'black' }}>Locations for {localStorage.getItem('campaignName')}</h2>
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
              <MarkerF key={index} position={{lat: Number(item.coordinates.split(', ')[0]), lng: Number(item.coordinates.split(', ')[1])}} onClick={()=>handleRecordData(parseInt(item.locationId))}/>
            ))}
          </GoogleMap>
        </React.Fragment>
      ) : (
        <h2 style={{ color: 'black', marginTop:'50px' }}>No locations for this campaign</h2>
      )}
    </div>
  );
  
}

export default Map;
