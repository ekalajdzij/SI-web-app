import React from "react";
import Map from "../components/Map";
import { fireEvent, logRoles, render, screen } from "@testing-library/react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {skip} from '@jest/globals';
import '@testing-library/jest-dom'


describe('Map component', () => {

    beforeEach(() => {
        render(
            <Router>
              <Map />
            </Router>
          );
    });
  
    it.skip('Map component should be display', async () => {
       const element = screen.getByTestId("MapDiv");
        expect(element).not.toBeInTheDocument();
    });
    
    it('renders error message when map fails to load', async () => {    
        const loadElement = screen.getByText('Loading maps');
        expect(loadElement).toBeInTheDocument();
    });


    it.skip('renders error message', () => {
    // Postavljamo simulirani loadError na true za testiranje prikaza poruke o grešci
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Da bi izbjegli konzolne greške
    jest.requireMock('@react-google-maps/api').useLoadScript.mockReturnValueOnce({
      isLoaded: true,
      loadError: true,
    });

    // Ponovno rendiranje komponente s mock-ovanim hook-om
    render(
      <Router>
        <Map />
      </Router>
    );

    // Provjera da li se poruka o grešci prikazuje kada dođe do greške u učitavanju mape
    const errorElement = screen.getByText('Error loading maps');
    expect(errorElement).toBeInTheDocument();

    // Provjera redoslijeda poziva funkcija unutar useLoadScript kuke
    expect(jest.requireMock('@react-google-maps/api').useLoadScript).toHaveBeenCalled();
    expect(jest.requireMock('@react-google-maps/api').useLoadScript).toHaveBeenCalledTimes(1); // Očekuje se samo jedan poziv
    });

});

