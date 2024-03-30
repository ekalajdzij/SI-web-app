
import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msalConfig.jsx'; 

const msalInstance = new PublicClientApplication(msalConfig);


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
