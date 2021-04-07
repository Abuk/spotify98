import Cookies from "js-cookie";
import axios from "axios";
import { handleUserLoginState } from "../../App";

export const getLoginState = () => {
  if (typeof Cookies.get("access_token") === "undefined") {
    if (!typeof Cookies.get("refresh_token") === "undefined") {
      if (!refreshAccessToken()) {
        Cookies.remove("refresh_token");
        return false;
      } else {
        return true;
      }
    }
  } else return true;
};

export const refreshAccessToken = () => {
  //shouldnt hardcode server url..
  axios
    .post(
      "http://localhost:4000/api/refresh_token",
      JSON.stringify(Cookies.get("access_token"))
    )
    .then((res) => {
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    });
};

export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};
