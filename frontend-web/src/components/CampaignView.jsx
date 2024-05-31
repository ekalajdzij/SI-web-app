import React, { useEffect, useState } from "react";
import "../css/CampaignView.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import moment from "moment";

function CampaignView() {
  const [selectedList, setSelect] = useState([]);

  const navigate = useNavigate();
  const [destinacije, setDestinacije] = useState([]);

  const [editableRow, setEditableRow] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  const [editedData, setEditedData] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenAssign, setModalOpenAssign] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [modalOpenD, setModalOpenD] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState();

  const [users, setUsers] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : []
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://fieldlogistics-control.azurewebsites.net/api/campaigns/company/${company}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const data1 = response.data;
        if (data1) {
          setDestinacije(data1);
          localStorage.setItem("campaignData", JSON.stringify(data1));
        }
      } catch (error) {
        console.error(
          "There was a problem with fetching campaign data:",
          error
        );
      }
    };
    fetchData();
  }, []);

  const onChangeEdit = (id, field, e) => {
    const value = e.target.value;
    setEditedData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const formatirajDatum = (datum) => {
    const dateObj = new Date(datum);
    const dan = dateObj.getDate();
    const mjesec = dateObj.getMonth() + 1;
    const godina = dateObj.getFullYear();
    return `${dan}.${mjesec}.${godina}`;
  };

  const handleEditClick = (id) => {
    const foundDest = destinacije.find((dest) => dest.id === id);

    setEditableRow(id);
    setEditedData({
      ...editedData,
      [id]: {
        id: foundDest.id,
        name: foundDest.name,
        description: foundDest.description,
        companyId: company,
        startDate: moment(foundDest.startDate).format("YYYY-MM-DD"),
        endDate: moment(foundDest.endDate).format("YYYY-MM-DD"),
      },
    });
  };

  const AssignUser = async (id) => {
    //console.log(id);
    setId(id);
    localStorage.setItem("id-i", id);

    try {
      //const id = parseInt(localStorage.getItem('campId'))
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://fieldlogistics-control.azurewebsites.net/api/user/campaigns/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.headers.authorization) {
        localStorage.setItem("accessToken", response.headers.authorization);
      }
      /*localStorage.setItem('userForCampaign', JSON.stringify(response.data));
      setUserData(response.data);*/

      const userIds = response.data.map((u) => u.userId);
      //console.log(response.data);
      //console.log(userIds);
      if (localStorage.getItem("company") && localStorage.getItem("userData")) {
        const filteredUsers = JSON.parse(
          localStorage.getItem("userData")
        ).filter((u) => u.companyId == localStorage.getItem("company"));
        const finalFilteredUsers = filteredUsers.filter(
          (user) => !userIds.includes(user.id)
        );
        //localStorage.setItem('selectList', JSON.stringify(finalFilteredUsers));
        setSelect(finalFilteredUsers);
        //console.log(finalFilteredUsers)
        //localStorage.setItem('campId', id)
        setModalOpenAssign(true);
        setName(destinacije.find((destinacija) => destinacija.id === id)?.name);
      }
    } catch (error) {
      console.error("There was a problem with fetching company data:", error);
    }
  };
  const JAssignUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "https://fieldlogistics-control.azurewebsites.net/api/user/campaigns",
        {
          userId: selectedUser,
          campaignId: localStorage.getItem("id-i"),
          status: "none",
          locationId: null,
          workingStatus: "none",
        },
        {
          headers: {
            Authorization: `${token}`,
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

  const handleDoubleClick = async (id) => {
    // console.log(id);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://fieldlogistics-control.azurewebsites.net/api/user/campaigns/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.headers.authorization) {
        localStorage.setItem("accessToken", response.headers.authorization);
      }
      localStorage.setItem("userForCampaign", JSON.stringify(response.data));

      const userIds = response.data.map((u) => u.userId);
      //console.log(response.data);
      //console.log(userIds);
      if (localStorage.getItem("company")) {
        const filteredUsers = users.filter(
          (u) => u.companyId == localStorage.getItem("company")
        );
        const finalFilteredUsers = filteredUsers.filter(
          (user) => !userIds.includes(user.id)
        );
        localStorage.setItem("selectList", JSON.stringify(finalFilteredUsers));
        localStorage.setItem("campId", id);
        navigate("/usercamp");
      }
    } catch (error) {
      console.error("There was a problem with fetching company data:", error);
    }
  };
  const handleMaps = async (id) => {
    localStorage.setItem(
      "campaignName",
      destinacije.find((destinacija) => destinacija.id === id)?.name
    );

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://fieldlogistics-control.azurewebsites.net/api/campaigns/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.headers.authorization) {
        localStorage.setItem("accessToken", response.headers.authorization);
      }

      localStorage.setItem(
        "locations",
        JSON.stringify(response.data.locations)
      );
      //console.log(localStorage.getItem('locations'));
    } catch (error) {
      console.error("There was a problem with fetching company data:", error);
    }

    // console.log(id);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://fieldlogistics-control.azurewebsites.net/api/location/record/coordinates/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.headers.authorization) {
        localStorage.setItem("accessToken", response.headers.authorization);
      }

      localStorage.setItem("records", JSON.stringify(response.data));
      //console.log(response)
      //console.log(localStorage.getItem('records'));
      //localStorage.setItem('campId', id);
      navigate("/map");
    } catch (error) {
      console.error("There was a problem with fetching company data:", error);
    }
  };

  const handleOneClick = async (id) => {
    localStorage.setItem(
      "campaignName",
      destinacije.find((destinacija) => destinacija.id === id)?.name
    );

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://fieldlogistics-control.azurewebsites.net/api/campaigns/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.headers.authorization) {
        localStorage.setItem("accessToken", response.headers.authorization);
      }
      if (localStorage.getItem("company")) {
        localStorage.setItem(
          "locations",
          JSON.stringify(response.data.locations)
        );
        //console.log(localStorage.getItem('locations'));
        localStorage.setItem("campId", id);
        navigate("/location");
      }
    } catch (error) {
      console.error("There was a problem with fetching company data:", error);
    }
  };

  const handleCombinedClick = (id) => {
    if (clickTimeout != null) {
      handleDoubleClick(id);
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    } else {
      const newTimeout = setTimeout(() => {
        handleOneClick(id);
        setClickTimeout(null);
      }, 700);
      setClickTimeout(newTimeout);
    }
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
  const handleConfirm = async (id) => {
    //console.log(editedData[id]);
    //console.log(destinacije[0]);
    if (
      editedData[id].startDate < editedData[id].endDate &&
      editedData[id].startDate != "" &&
      editedData[id].startDate != "" &&
      editedData[id].name != ""
    ) {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://fieldlogistics-control.azurewebsites.net/api/campaigns/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedData[id]),
        }
      );
      localStorage.setItem("accessToken", [...response.headers][0][1]);
      const updatedDest = destinacije.map((d) =>
        d.id === id ? editedData[id] : d
      );
      setDestinacije(updatedDest);
      localStorage.setItem("campaignData", JSON.stringify(updatedDest));
      setEditableRow(null);
      if (!response.ok) {
        throw new Error("Problem sa ažuriranjem admina");
      }
    } else {
      alert("Neispravni podaci");
    }
  };

  function hasEmptyFields(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (hasEmptyFields(obj[key])) {
          return true;
        }
      } else if (obj[key] === "") {
        return true;
      }
    }
    return false;
  }

  const handleSubmitLokacija = async () => {
    if (hasEmptyFields(novaLokacija)) {
      alert("All fields have to be filled");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "https://fieldlogistics-control.azurewebsites.net/api/location",
        novaLokacija,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.headers.authorization)
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
  const handleDeleteCampaign = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `https://fieldlogistics-control.azurewebsites.net/api/campaigns/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      localStorage.setItem("accessToken", [...response.headers][0][1]);
      if (response.ok) {
        const updatedDest = destinacije.filter((d) => d.id !== id);
        setDestinacije(updatedDest);
        localStorage.setItem("campaignData", JSON.stringify(updatedDest));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const generateExcel = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://fieldlogistics-control.azurewebsites.net/export/excel/campaign/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
          responseType: "blob",
        }
      );

      if (response.headers.authorization) {
        localStorage.setItem("accessToken", response.headers.authorization);
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Campaign-${id}-Records.xlsx`;
      a.click();
    } catch (error) {
      console.error("There was a problem with fetching company data:", error);
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
              onClick={(e) => {
                e.stopPropagation();
                setModalOpenD(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="destinacije">
        {destinacije.map((destinacija) => (
          <div
            className="komponenta"
            key={destinacija.id}
            onClick={() => handleCombinedClick(destinacija.id)}
          >
            {editableRow === destinacija.id ? (
              <div
                className="input-polje"
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <input
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  type="text"
                  className="detalji"
                  value={editedData[destinacija.id]?.name ?? destinacija.name}
                  onChange={(e) => onChangeEdit(destinacija.id, "name", e)}
                  style={{
                    marginBottom: "20px",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  type="text"
                  className="detalji"
                  value={
                    editedData[destinacija.id]?.description ??
                    destinacija.description
                  }
                  onChange={(e) =>
                    onChangeEdit(destinacija.id, "description", e)
                  }
                  style={{
                    marginBottom: "20px",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  type="date"
                  className="detalji"
                  value={
                    editedData[destinacija.id]?.startDate ??
                    formatirajDatum(destinacija.startDate)
                  }
                  onChange={(e) => onChangeEdit(destinacija.id, "startDate", e)}
                  style={{
                    marginBottom: "20px",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  type="date"
                  className="detalji"
                  value={
                    editedData[destinacija.id]?.endDate ??
                    formatirajDatum(destinacija.endDate)
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    onChangeEdit(destinacija.id, "endDate", e);
                  }}
                  style={{
                    marginBottom: "20px",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirm(destinacija.id);
                  }}
                >
                  Confirm
                </button>
              </div>
            ) : (
              <div>
                <h2>{destinacija.name}</h2>
                <p className="detalji">
                  Description: {destinacija.description}{" "}
                </p>
                <p className="detalji">
                  Start Date: {formatirajDatum(destinacija.startDate)}{" "}
                </p>
                <p className="detalji">
                  End Date: {formatirajDatum(destinacija.endDate)}{" "}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    AssignUser(destinacija.id);
                  }}
                >
                  Assign user
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    makeLocation(destinacija.id);
                  }}
                >
                  Create location
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(destinacija.id);
                  }}
                >
                  Update
                </button>
                <button
                  style={{ marginBottom: "30px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMaps(destinacija.id);
                  }}
                >
                  Locations on Maps
                </button>
                <img
                  src="https://static-00.iconduck.com/assets.00/ms-excel-icon-2048x2026-nws24wyy.png"
                  alt="excel"
                  className="excelIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    generateExcel(destinacija.id);
                  }}
                />
                <FaTrash
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "15px",
                    fontSize: "32px",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCampaign(destinacija.id);
                  }}
                />
              </div>
            )}
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
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(false);
              }}
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
              {selectedList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            <button onClick={JAssignUser}>Assign</button>
            <button
              className="cancelButton"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpenAssign(false);
              }}
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
