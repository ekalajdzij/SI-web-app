import React, { useState } from 'react';
import "../css/AddAdminModal.css";


function AddAdminModal({ closeModal, companyData, setAdminData }) {
    // console.log(formData);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        phoneNumber: '',
        companyId: '', 
    });

    //console.log(formData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const encoder = new TextEncoder();
        const data = encoder.encode(formData.password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch('https://fieldlogistics-control.azurewebsites.net/api/admin', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, secretKey: '', token: '', password:hashHex, isSuperAdmin: false }),
            });

            if (!response.ok) {
                throw new Error('Problem pri dodavanju novog admina');
            }
            let newAdmin = await response.json();
            

            let currentAdminData = JSON.parse(localStorage.getItem('adminData')) || [];
            try {
                const response = await fetch(`https://fieldlogistics-control.azurewebsites.net/api/company/${formData.companyId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Problem pri dohvaćanju podataka o kompaniji');
                }
                const companyData = await response.json();
                newAdmin = { ...newAdmin, company: companyData.name };         //const companyName=companyData.data.name;
                // Ovdje možete postupiti s podacima o kompaniji kako je potrebno
            } catch (error) {
                console.error('Greška prilikom dohvaćanja podataka o kompaniji:', error);
            }





            currentAdminData.push(newAdmin);


            localStorage.setItem('adminData', JSON.stringify(currentAdminData));


            setAdminData(currentAdminData);

            closeModal();
        } catch (error) {
            console.error('Greška prilikom dodavanja novog admina:', error);
        }
    };



    return (
        <div className="modal" id="add-admin-modal">
            <form onSubmit={handleSubmit}>
                <input name="username" type="text" placeholder="Username" onChange={handleInputChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required />
                <input name="phoneNumber" type="text" placeholder="PhoneNumber" onChange={handleInputChange} required />
                <select name="companyId" onChange={handleInputChange} required>
                    <option value="">Select Company</option>
                    {companyData.map((company) => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                </select>
                <button type="submit" className="submit-btn">Submit</button>
                <button onClick={closeModal} className="cancel-btn">Cancel</button>
            </form>
        </div>
    );
}

export default AddAdminModal;
