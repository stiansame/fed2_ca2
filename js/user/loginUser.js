import { API_BASE, API_AUTH, API_LOGIN } from "../api/apiEndpoints.js";
import { myUser } from "../api/apiKeys.js";
import { saveToLocalStorage } from "./localStorage.js";

const loginUrl = API_BASE + API_AUTH + API_LOGIN;

const filterUser = (user) => {
  const { name, ...rest } = user;
  return rest;
};

const userToLogin = filterUser(myUser);

async function userLogin(url, userData) {
  try {
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    const { accessToken, ...profile } = json.data;
    saveToLocalStorage("profile", profile);
    saveToLocalStorage("accessToken", accessToken);
  } catch (error) {
    console.log(error);
  }
}

userLogin(loginUrl, userToLogin);
