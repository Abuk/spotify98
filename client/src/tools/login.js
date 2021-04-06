import Cookies from "js-cookie";

export const getLoginState = () => {
  if (typeof Cookies.get("access_token") === "undefined") return false;
  else return true;
};
