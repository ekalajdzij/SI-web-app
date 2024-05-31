import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import "../css/CRUDadmin.css";
import AddAdminModal from "./AddAdminModal"; // Pretpostavljamo da je ovo vaša modalna komponenta

function CRUDadmin() {
  const [adminData, setAdminData] = useState(
    JSON.parse(localStorage.getItem("adminData")) || []
  );
  const [companyData, setCompanyData] = useState(
    JSON.parse(localStorage.getItem("companyData")) || []
  );
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("adminData");
    if (data) {
      const parsedData = JSON.parse(data);
      setAdminData(parsedData);
    }
  }, []);

  const handleEditClick = (id) => {
    //console.log(adminData)
    const foundAdmin = adminData.find((admin) => admin.id === id);
    const foundCompany = companyData.find(
      (comp) => comp.name == foundAdmin.company
    );
    //console.log(foundCompany);
    //console.log(foundAdmin);
    setEditableRow(id);
    setEditedData({
      ...editedData,
      [id]: {
        Id: foundAdmin.id,
        Username: foundAdmin.username,
        Password: foundAdmin.password,
        IsSuperAdmin: foundAdmin.isSuperAdmin,
        CompanyId: foundCompany.id,
        PhoneNumber: foundAdmin.phoneNumber,
        SecretKey: foundAdmin.secretKey,
      },
    });
  };

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  };

  const deleteAdmin = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:5200/api/admin/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      localStorage.setItem("accessToken", [...response.headers][0][1]);
      if (!response.ok) {
        throw new Error("Problem sa brisanjem admina");
      }
      const updatedAdmins = adminData.filter((admin) => admin.id !== id);
      setAdminData(updatedAdmins);
      localStorage.setItem("adminData", JSON.stringify(updatedAdmins));
    } catch (error) {
      console.error("Greška prilikom brisanja admina:", error);
    }
  };
  const handleConfirmEdit = async (id) => {
    try {
      //console.log(editedData[id]);
      if (editedData[id].password) {
        editedData[id].password = await hashPassword(editedData[id].password);
        //console.log(editedData[id].password);
      }
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:5200/api/admin/${id}`,
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
      if (!response.ok) {
        throw new Error("Problem sa ažuriranjem admina");
      }
      const updatedAdmin = editedData[id];

      if (editedData[id].companyId) {
        //console.log(editedData[id].companyId)
        //console.log(companyData);
        const companyName = companyData.find(
          (company) => company.id == editedData[id].companyId
        );
        //console.log(companyName);

        const updatedAdmins = adminData.map((admin) =>
          admin.id === id
            ? { ...admin, ...updatedAdmin, company: companyName.name }
            : admin
        );
        setAdminData(updatedAdmins);
        localStorage.setItem("adminData", JSON.stringify(updatedAdmins));
      } else {
        const updatedAdmins = adminData.map((admin) =>
          admin.id === id ? { ...admin, ...updatedAdmin } : admin
        );
        setAdminData(updatedAdmins);
        localStorage.setItem("adminData", JSON.stringify(updatedAdmins));
      }

      setEditableRow(null);
    } catch (error) {
      console.error("Greška prilikom ažuriranja admina:", error);
    }
  };
  const handleInputChange = (e, field, id) => {
    const value = e.target.value;
    setEditedData({
      ...editedData,
      [id]: {
        ...editedData[id],
        [field]: value,
      },
    });
  };

  return (
    <div className="table-container">
      <div id="main">
        <h2 id="title">Admins</h2>
        <button onClick={() => setShowModal(true)}>Add Admin</button>
      </div>

      <table id="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>

            <th>PhoneNumber</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminData
            .filter((admin) => !admin.isSuperAdmin)
            .map((admin) => (
              <tr key={admin.id}>
                <td>
                  {editableRow === admin.id ? (
                    <input
                      type="text"
                      name="username"
                      value={editedData[admin.id]?.username ?? admin.username}
                      onChange={(e) =>
                        handleInputChange(e, "username", admin.id)
                      }
                    />
                  ) : (
                    admin.username
                  )}
                </td>
                <td>
                  {editableRow === admin.id ? (
                    <input
                      type="password"
                      name="password"
                      value={editedData[admin.id]?.password ?? "XXXXXX"}
                      onChange={(e) =>
                        handleInputChange(e, "password", admin.id)
                      }
                    />
                  ) : (
                    "XXXXXX"
                  )}
                </td>
                <td>
                  {editableRow === admin.id ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={
                        editedData[admin.id]?.phoneNumber ?? admin.phoneNumber
                      }
                      onChange={(e) =>
                        handleInputChange(e, "phoneNumber", admin.id)
                      }
                    />
                  ) : (
                    admin.phoneNumber
                  )}
                </td>
                <td>
                  {editableRow === admin.id ? (
                    <select
                      name="companyId"
                      value={
                        editedData[admin.id]?.companyId ||
                        companyData.find((comp) => comp.name === admin.company)
                          ?.id
                      }
                      onChange={(e) =>
                        handleInputChange(e, "companyId", admin.id)
                      }
                    >
                      {companyData.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    admin.company || "N/A"
                  )}
                </td>
                <td className="actions-column">
                  {editableRow === admin.id ? (
                    <>
                      <FaCheck
                        onClick={() => handleConfirmEdit(admin.id)}
                        className="confirmEditBtn"
                      />
                    </>
                  ) : (
                    <FaEdit
                      onClick={() => handleEditClick(admin.id)}
                      className="editBtn"
                    />
                  )}

                  <FaTrash
                    className="delete-icon"
                    onClick={() => deleteAdmin(admin.id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {showModal && (
        <AddAdminModal
          closeModal={() => setShowModal(false)}
          companyData={companyData}
          setAdminData={setAdminData}
        />
      )}
    </div>
  );
}

export default CRUDadmin;
