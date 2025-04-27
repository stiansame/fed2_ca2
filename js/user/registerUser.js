import { API_BASE, API_REGISTER, API_AUTH } from "../api/apiEndpoints.js";
import { myUser } from "../api/apiKeys.js";

async function registerUser(url, userData) {
  try {
    const postData = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(registerUrl, postData);
    console.log("response", response);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
}

const registerUrl = API_BASE + API_AUTH + API_REGISTER;

registerUser(registerUrl, myUser);
