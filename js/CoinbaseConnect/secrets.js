export const ClientSecret = "YOUR_COINBASE_CLIENT_SECRET";

export const ClientID = "YOUR_COINBASE_CLIENT_ID";

export const AccessURL = `https://www.coinbase.com/oauth/authorize?client_id=${ClientID}&redirect_uri=${window.location.origin}/connect.html&response_type=code&scope=wallet%3Auser%3Aread,wallet:accounts:read,wallet:addresses:read`;

export const RedirectURI = `${window.location.origin}/connect.html`;
