const clientId = import.meta.env.VITE_CLIENT_ID;
const authority = import.meta.env.VITE_AUTHORITY;
export const msalConfig = {
    auth: {
        clientId:clientId,
        authority:authority,
        redirectUri: window.origin.location
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};
