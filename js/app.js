import {
  AccessURL,
  ClientID,
  ClientSecret,
  RedirectURI,
} from "./CoinbaseConnect/secrets.js";

const connectToCoinbase = () => {
  const options =
    "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";
  window.open(AccessURL, "Connect to Coinbase", options);

  const container = document.getElementById("container");
  const connectToCoinbaseButton = document.getElementById("connectToCoinbase");
  container.removeChild(connectToCoinbaseButton);

  const animationDiv = document.createElement("div");
  animationDiv.classList.add("container__loading");

  const animationElement1 = document.createElement("div");
  animationElement1.classList.add("container__loadingElement");
  const animationElement2 = document.createElement("div");
  animationElement2.classList.add("container__loadingElement");
  const animationElement3 = document.createElement("div");
  animationElement3.classList.add("container__loadingElement");

  animationDiv.appendChild(animationElement1);
  animationDiv.appendChild(animationElement2);
  animationDiv.appendChild(animationElement3);

  container.appendChild(animationDiv);
};

const connectToCoinbaseButton = document
  .getElementById("connectToCoinbase")
  .addEventListener("click", connectToCoinbase);

const RetrieveData = async (token) => {
  const options = {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const res = await fetch(`https://api.coinbase.com/v2/accounts/`, options);
    const accounts = await res.json();

    const { id, currency } = accounts.data[0];
    const { code, name } = currency;

    const addressesRes = await fetch(
      `https://api.coinbase.com/v2/accounts/${id}/addresses`,
      options
    );
    const address = await addressesRes.json();

    const userRes = await fetch(`https://api.coinbase.com/v2/user`, options);
    const user = await userRes.json();

    const details = {
      code,
      currencyName: name,
      address: address.data[0].address,
      avatar: user.data.avatar_url,
      name: user.data.name,
      balance: accounts.data[0].balance.amount,
    };

    return details;
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("message", (e) => {
  const urlParams = new URLSearchParams(e.data);
  const code = urlParams.get("code");

  if (code) {
    const values = {
      grant_type: "authorization_code",
      code,
      client_id: ClientID,
      client_secret: ClientSecret,
      redirect_uri: RedirectURI,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    fetch("https://api.coinbase.com/oauth/token", options)
      .then((res) => res.json())
      .then((data) => RetrieveData(data))
      .then((data) => {
        const container = document.getElementById("container");
        const loadingAnimation = document.querySelector(".container__loading");
        container.removeChild(loadingAnimation);

        const profileContainer = document.createElement("div");
        profileContainer.classList.add("container__profileContainer");

        const profilePicture = document.createElement("img");
        profilePicture.src = data.avatar;
        const name = document.createElement("h3");
        name.textContent = data.name;
        const address = document.createElement("p");
        address.textContent = data.address;
        const balance = document.createElement("p");
        balance.textContent = `${data.code} ${data.balance}`;

        profileContainer.appendChild(profilePicture);
        profileContainer.appendChild(name);
        profileContainer.appendChild(balance);
        profileContainer.appendChild(address);

        container.appendChild(profileContainer);
      })
      .catch((err) => console.error(err));
  }
});
