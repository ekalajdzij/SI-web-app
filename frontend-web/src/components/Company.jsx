import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import "../css/Company.css";

function Company() {
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompany, setNewCompany] = useState("");

  const [companies, setCompanies] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");

  useEffect(() => {
    const storedCompanies = localStorage.getItem("companyData");
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `https://fieldlogistics-control.azurewebsites.net/api/company/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      ).then(response=>{
        localStorage.setItem("accessToken", response.headers.authorization);

      });
      const updatedCompanies = companies.filter((company) => company.id !== id);
      setCompanies(updatedCompanies);
      localStorage.setItem("companyData", JSON.stringify(updatedCompanies));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleConfirm = async (id) => {
    const token = localStorage.getItem("accessToken");
    //console.log(id);
    //console.log(newCompanyName)

    try {
      const response = await fetch(
        `https://fieldlogistics-control.azurewebsites.net/api/company/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(newCompanyName),
        }
      );
      localStorage.setItem("accessToken", [...response.headers][0][1]);

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Error response from server:", errorResponse);
        throw new Error("Network response was not ok");
      }

      const updatedCompanies = companies.map((company) =>
        company.id === id ? { ...company, name: newCompanyName } : company
      );
      setCompanies(updatedCompanies);
      localStorage.setItem("companyData", JSON.stringify(updatedCompanies));

      setEditableRow(null);
      setNewCompanyName("");
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };
  const handleAddCompany = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "https://fieldlogistics-control.azurewebsites.net/api/company",
        {
          Name: newCompany, 
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      localStorage.setItem("accessToken", [...response.headers][0][1]);

      if (response.status === 201) {
        const addedCompany = response.data;
        const updatedCompanies = [...companies, addedCompany];
        setCompanies(updatedCompanies);
        localStorage.setItem("companyData", JSON.stringify(updatedCompanies));
        setIsAddingCompany(false);
        setNewCompany("");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  return (
    <div id="companyContainer">
      <div id="main">
        <h2 id="title">Companies</h2>
        <button id="addCompanyButton" onClick={() => setIsAddingCompany(true)}>
          Add Company
        </button>
      </div>

      {isAddingCompany && (
        <div className="modal" id="addCompanyModal">
          <input
            id="inputAdd"
            type="text"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            placeholder="Enter new company name"
          />
          <button id="createCompanyButton" onClick={handleAddCompany}>
            Create
          </button>
          <button
            id="cancelCompanyButton"
            onClick={() => setIsAddingCompany(false)}
          >
            Cancel
          </button>
        </div>
      )}
      <table className="companyTable" id="companyTable">
        <thead>
          <tr>
            <th id="companyNameHeader">Name</th>
            <th id="companyActionsHeader">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="companyTableRow">
              <td className="companyName">
                {editableRow === company.id ? (
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Update company name"
                    className="companyNameInput"
                  />
                ) : (
                  company.name
                )}
              </td>
              <td className="companyActions">
                {editableRow === company.id ? (
                  <FaCheck
                    className="companyUpdateIcon"
                    onClick={() => handleConfirm(company.id)}
                  />
                ) : (
                  <FaEdit
                    className="companyUpdateIcon"
                    onClick={() => {
                      setEditableRow(company.id);
                      setNewCompanyName(company.name);
                    }}
                  />
                )}
                <FaTrash
                  className="companyDeleteIcon"
                  onClick={() => handleDelete(company.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Company;
