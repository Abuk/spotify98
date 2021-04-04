const querystring = require("querystring");
const axios = require("axios").default;
const qs = require("querystring");
const FormData = require("form-data");
const c_id = process.env.CLIENT_ID;
const c_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const scopes = "user-read-private user-read-email user-library-read";
const stateKey = "spotify_auth_state";

const generateState = (length) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const login = (res) => {
  const state = generateState(16);
  res.cookie(stateKey, state);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: c_id,
        scope: scopes,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
};

const callback = (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    const authUrl = "https://accounts.spotify.com/api/token";
    const data = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
    };
    const formData = new URLSearchParams();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    var authOptions = {
      headers: {
        Authorization:
          "Basic " + Buffer.from(c_id + ":" + c_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Content-Length": formData.toString().length,
      },
    };

    axios
      .post(authUrl, formData.toString(), authOptions)
      .then((response) => {
        console.log(response.status);
        console.log(response);
        if (response.status == 200) {
          const access_token = response.data.access_token;
          const refresh_token = response.data.refresh_token;
          const meUrl = "https://api.spotify.com/v1/me";
          const options = {
            headers: { Authorization: "Bearer " + access_token },
          };

          axios.get(meUrl, options).then((res) => {
            console.log(res.data);
          });

          res.redirect(
            "/#" +
              querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token,
              })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      });
  }
};

module.exports = {
  login: login,
  callback: callback,
};
