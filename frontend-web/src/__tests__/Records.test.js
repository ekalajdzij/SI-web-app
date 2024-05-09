import React from "react";
import Records from "../components/Records";
import { fireEvent, logRoles, render, screen } from "@testing-library/react";
import { BrowserRouter as Router,  Routes,  Route} from "react-router-dom"
import {skip} from '@jest/globals';
import '@testing-library/jest-dom'


describe('Records component', () => {

    beforeEach(() => {
        render(
            <Router>
              <Records />
            </Router>
          );
    });
  
    it('Records component should be display', async () => {
        const element = screen.getByTestId("DivRecords");
        expect(element).toBeInTheDocument();
    });
    
    it('Records component should display message in case records are not present', async () => {
        const noRecordsMessage = screen.getByText(/There is no record for this location/i);
        expect(noRecordsMessage.innerHTML).toBe('There is no record for this location');
    });
    
    it.skip('Record component should display record data', async () => {
        const testLocationData = [{
            typeOfLocation:"Muzej",
            contactNumber:'+385',
            description:'Muzej Nikole Tesle u Zagrebu',
        }];

        const testRecordData = [{
            serialNumber:' asdsa',
            inventoryNumber: 65454,
            gpsCoordinates: '43.8598, 18.4313',
            fullAddress:'sdd',
            photoUrl:''
        }];

        const testCampaignNameData = 'Zagreb';

        render(
            <Records />,
            {
                initialState: { 
                    recordData: testRecordData,
                    location: testLocationData,
                    campaignName: testCampaignNameData
                }
            }
        );
        

        const recordLable = screen.getByText(/Record for Location:Muzej within Campaign: Zagreb/i);
        expect(recordLable.innerHTML).toBe('Record for Location:Muzej within Campaign: Zagreb');

    });    
});



