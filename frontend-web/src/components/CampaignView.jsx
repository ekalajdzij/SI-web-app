import React, { useEffect, useState } from 'react';
import '../css/CampaignView.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function CampaignView() {
    const navigate = useNavigate();
    const [destinacije, setDestinacije] = useState(JSON.parse(localStorage.getItem('campaignData')));
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenAssign, setModalOpenAssign] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [modalOpenD, setModalOpenD] = useState(false);
    const [name, setName] = useState("");
    const [id, setId] = useState();

    const [users, setUsers] = useState(JSON.parse(localStorage.getItem('userData')) || []);


    const [company, setCompId] = useState(localStorage.getItem('company'));
    const [companyName, setCompName] = useState(localStorage.getItem('companyName'));


    const [novaDestinacija, setNovaDestinacija] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    const [novaLokacija, setNovaLokacija] = useState({
        TypeOfLocation: '',
        Address: '',
        ContactNumber: '',
        Description: '',
        CampaignId: '',
        UserId: null
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
        setName(destinacije.find(destinacija => destinacija.id === id)?.name);

    }
    const JAssignUser = async () => {

        try {
            const response = await axios.post('https://fieldlogistics-control.azurewebsites.net/api/user/campaigns', {
                UserId: selectedUser,
                CampaignId: id,
                Status:"none",
                LocationId:null

            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            
            setModalOpenAssign(false);
            setSelectedUser('');
        }
        catch (error) {
            console.error('Error creating destination:', error);
        }

    }
    const makeLocation = (id) => {
        //console.log(id);
        setNovaLokacija(prevState => ({
            ...prevState,
            CampaignId: JSON.stringify(id)
        }));
        setModalOpen(true);
        setName(destinacije.find(destinacija => destinacija.id === id)?.name);
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovaDestinacija(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleChangeLokacija = (e) => {
        const { name, value } = e.target;
        setNovaLokacija(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitDestinacija = async () => {
        try {
            if (novaDestinacija.endDate < novaDestinacija.startDate) {
                throw ("Neispravni podaci");
            }
            else
            {
                const response = await axios.post('https://fieldlogistics-control.azurewebsites.net/api/campaigns', 
                {
                    ...novaDestinacija,
                    companyId: localStorage.getItem('company')
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (response.data) {
                    let currentUserData = JSON.parse(localStorage.getItem('campaignData')) || [];
                    setDestinacije(prevUserData => [...prevUserData, response.data]);
                    currentUserData.push(response.data);
                    localStorage.setItem('campaignData', JSON.stringify(currentUserData))
                }

                setModalOpenD(false);
                setNovaDestinacija( 
                    {name: '',
                    description: '',
                    startDate: '',
                    endDate: ''})
                }

        } 
        catch (error) {
            console.error('Error creating destination:', error);
        }
    };

    const handleSubmitLokacija = async () => {
        try {
            console.log(novaLokacija)
            const response = await axios.post('https://fieldlogistics-control.azurewebsites.net/api/location', novaLokacija);

            setModalOpen(false);
            setNovaLokacija({
                TypeOfLocation: '',
                Address: '',
                ContactNumber: '',
                Description: '',
                CampaignId: '',
                UserId: null
            });

        } catch (error) {
            console.error('Error creating location:', error);
        }
    };

    return (
        <div className='wrapper' data-testid="ID1">
            <h2 id='titleC'>Campaigns for {companyName}</h2>

            <button onClick={() => setModalOpenD(true)}>Add Campaign</button>


            {
            modalOpenD && (
                <div className='modal' data-testid="formForAddingCampaign">
                    <div className='modal-content'>
                        <span className='close' onClick={() => setModalOpenD(false)}>&times;</span>
                        
                        <h2>Add Campaign</h2>
                        <input type='text' name='name' placeholder='Name' value={novaDestinacija.name} onChange={handleChange} />
                        <input type='text' name='description' placeholder='Description' value={novaDestinacija.description} onChange={handleChange} />
                        <input type='date' name='startDate' placeholder='Start Date' value={novaDestinacija.startDate} onChange={handleChange} />
                        <input type='date' name='endDate' placeholder='End Date' value={novaDestinacija.endDate} onChange={handleChange} />
                        
                        <button data-testid="submitCampaignForm" onClick={handleSubmitDestinacija}>Create</button>
                    </div>
                </div>
            )
            }



        
    
            <div className='destinacije' data-testid="listOfDestinations">
            {/*
                destinacije.map((destinacija) => (
                    <div className='komponenta' key={destinacija.id}>
                        <h2>{destinacija.name}</h2>
                        <p className='detalji'>Description: {destinacija.description} </p>
                        <p className='detalji'>Start Date: {formatirajDatum(destinacija.startDate)} </p>
                        <p className='detalji'>End Date: {formatirajDatum(destinacija.endDate)} </p>
                        <button onClick={() => AssignUser(destinacija.id)}>
                            Assign user
                        </button>
                        <button onClick={() => makeLocation(destinacija.id)}>
                            Create location
                        </button>
                    </div>
                ))
                */
            }
            </div>
        


            {modalOpen && (
                <div className='modal' data-testid="formForAddingLocation" >
                    <div className='modal-content'>
                        <span className='close' onClick={() => setModalOpen(false)}>&times;</span>
                        <h3 id='lokacija'>Add location for {name}</h3>
                        <input type='text' name='TypeOfLocation' placeholder='Type Of Location' value={novaLokacija.TypeOfLocation} onChange={handleChangeLokacija} required/>
                        <input type='text' name='Address' placeholder='Address' value={novaLokacija.Address} onChange={handleChangeLokacija} required/>
                        <input type='text' name='ContactNumber' placeholder='Contact Number' value={novaLokacija.ContactNumber} onChange={handleChangeLokacija} />
                        <input type='text' name='Description' placeholder='Description' value={novaLokacija.Description} onChange={handleChangeLokacija} />
                        <button onClick={handleSubmitLokacija}>Create</button>
                    </div>
                </div>
            )}

            
            {modalOpenAssign && (
                <div className='modal' id='m' data-testid="formForAssigneLocationToUser">
                    <div className='modal-content'>
                        <span className='close' onClick={() => setModalOpenAssign(false)}>&times;</span>
                        <h4 id='user'>Select User for {name}</h4>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            style={{ color: 'black' }}
                        >
                            <option value=''>Select user</option>
                            {users.filter(user => user.companyId == company).map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                        <button onClick={JAssignUser}>Assign</button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default CampaignView;