import React, { useEffect, useState } from "react";
import "../css/CampaignView.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CampaignView() {
  const navigate = useNavigate();
  const [destinacije, setDestinacije] = useState(
    JSON.parse(localStorage.getItem("campaignData"))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenAssign, setModalOpenAssign] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [modalOpenD, setModalOpenD] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState();

  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("userData")) || []
  );

  const [company, setCompId] = useState(localStorage.getItem("company"));
  const [companyName, setCompName] = useState(
    localStorage.getItem("companyName")
  );

  const [novaDestinacija, setNovaDestinacija] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [novaLokacija, setNovaLokacija] = useState({
    TypeOfLocation: "",
    Address: "",
    ContactNumber: "",
    Description: "",
    CampaignId: "",
    UserId: null,
  });

  const formatirajDatum = (datum) => {
    const dateObj = new Date(datum);
    const dan = dateObj.getDate();
    const mjesec = dateObj.getMonth() + 1;
    const godina = dateObj.getFullYear();
    return `${dan}.${mjesec}.${godina}`;
  };
  const AssignUser = (id) => {
    console.log(id);
    setId(id);
    setModalOpenAssign(true);
    setName(destinacije.find((destinacija) => destinacija.id === id)?.name);
  };
  const JAssignUser = async () => {
    try {
      const response = await axios.post(
        "https://fieldlogistics-control.azurewebsites.net/api/user/campaigns",
        {
          UserId: selectedUser,
          CampaignId: id,
          Status: "none",
          LocationId: null,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        }
      );
      localStorage.setItem("accessToken", response.headers.authorization);

      setModalOpenAssign(false);
      setSelectedUser("");
    } catch (error) {
      console.error("Error creating destination:", error);
      alert("You have to choose some user");
    }
  };
  const makeLocation = (id) => {
    //console.log(id);
    setNovaLokacija((prevState) => ({
      ...prevState,
      CampaignId: JSON.stringify(id),
    }));
    setModalOpen(true);
    setName(destinacije.find((destinacija) => destinacija.id === id)?.name);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaDestinacija((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeLokacija = (e) => {
    const { name, value } = e.target;
    setNovaLokacija((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitDestinacija = async () => {
    try {
      if (novaDestinacija.endDate < novaDestinacija.startDate) {
        throw "Neispravni podaci";
      } else {
        const response = await axios.post(
          "https://fieldlogistics-control.azurewebsites.net/api/campaigns",
          {
            ...novaDestinacija,
            companyId: localStorage.getItem("company"),
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("accessToken")}`,
            },
          }
        );
        localStorage.setItem("accessToken", response.headers.authorization);
        if (response.data) {
          let currentUserData =
            JSON.parse(localStorage.getItem("campaignData")) || [];
          setDestinacije((prevUserData) => [...prevUserData, response.data]);
          currentUserData.push(response.data);
          localStorage.setItem("campaignData", JSON.stringify(currentUserData));
        }
        setModalOpenD(false);
        setNovaDestinacija({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
        });
      }
    } catch (error) {
      console.error("Error creating destination:", error);
      alert("All fields have to be filled");
    }
  };

  const handleSubmitLokacija = async () => {
    try {
      console.log(novaLokacija);
      const response = await axios.post(
        "https://fieldlogistics-control.azurewebsites.net/api/location",
        novaLokacija
      );
      if(response.headers.authorization)
      localStorage.setItem("accessToken", response.headers.authorization);

      setModalOpen(false);
      setNovaLokacija({
        TypeOfLocation: "",
        Address: "",
        ContactNumber: "",
        Description: "",
        CampaignId: "",
        UserId: null,
      });
    } catch (error) {
      console.error("Error creating location:", error);
    }
  };

  return (
    <div className="wrapper">
      <div id="main">
        <h2 id="title">Campaigns for {companyName}</h2>
        <button onClick={() => setModalOpenD(true)}>Add Campaign</button>
      </div>
      {modalOpenD && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Campaign</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={novaDestinacija.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={novaDestinacija.description}
              onChange={handleChange}
            />{" "}
            <div className="date-container">
              <label>Start Date</label>
              <input
                className="dateInput"
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={novaDestinacija.startDate}
                onChange={handleChange}
              />{" "}
            </div>
            <div className="date-container">
              <label>End Date</label>
              <input
                className="dateInput"
                type="date"
                name="endDate"
                placeholder="End Date"
                value={novaDestinacija.endDate}
                onChange={handleChange}
              />
            </div>
            <button onClick={handleSubmitDestinacija}>Create</button>
            <button
              className="cancelButton"
              onClick={() => setModalOpenD(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="destinacije">
        {destinacije.map((destinacija) => (
          <div className="komponenta" key={destinacija.id}>
            <h2>{destinacija.name}</h2>
            <p className="detalji">Description: {destinacija.description} </p>
            <p className="detalji">
              Start Date: {formatirajDatum(destinacija.startDate)}{" "}
            </p>
            <p className="detalji">
              End Date: {formatirajDatum(destinacija.endDate)}{" "}
            </p>
            <button onClick={() => AssignUser(destinacija.id)}>
              Assign user
            </button>
            <button onClick={() => makeLocation(destinacija.id)}>
              Create location
            </button>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3 id="lokacija">Add location for {name}</h3>
            <input
              type="text"
              name="TypeOfLocation"
              placeholder="Type Of Location"
              value={novaLokacija.TypeOfLocation}
              onChange={handleChangeLokacija}
              required
            />
            <input
              type="text"
              name="Address"
              placeholder="Address"
              value={novaLokacija.Address}
              onChange={handleChangeLokacija}
              required
            />
            <input
              type="text"
              name="ContactNumber"
              placeholder="Contact Number"
              value={novaLokacija.ContactNumber}
              onChange={handleChangeLokacija}
            />
            <input
              type="text"
              name="Description"
              placeholder="Description"
              value={novaLokacija.Description}
              onChange={handleChangeLokacija}
            />
            <button onClick={handleSubmitLokacija}>Create</button>
            <button
              className="cancelButton"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {modalOpenAssign && (
        <div className="modal" id="m">
          <div className="modal-content">
            <h4 id="user">Select User for {name}</h4>
            <select
              className="dropdown"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{ color: "black" }}
            >
              <option value="">Select user</option>
              {users
                .filter((user) => user.companyId == company)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
            </select>
            <button onClick={JAssignUser}>Assign</button>
            <button
              className="cancelButton"
              onClick={() => setModalOpenAssign(false)}
            >
              Cancel{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignView;
