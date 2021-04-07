const querystring = require("querystring");
const axios = require("axios").default;
const qs = require("querystring");
const FormData = require("form-data");
const c_id = process.env.CLIENT_ID;
const c_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const scopes =
  "streaming user-modify-playback-state user-read-currently-playing user-read-playback-state user-read-private user-read-email user-library-read";
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

const formDataBuilder = (data) => {
  var formData = new URLSearchParams();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return formData;
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
    var formData = formDataBuilder(data);

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
        console.log("Spotify API Responded with status:" + response.status);
        if (response.status == 200) {
          const access_token = response.data.access_token;
          const refresh_token = response.data.refresh_token;

          res.cookie("access_token", access_token, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
          });
          res.cookie("refresh_token", refresh_token);
          res.redirect("http://localhost:3000/");
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

const refreshToken = (req, res) => {
  const refresh_token = req.query.refresh_token;
  const refreshUrl = "https://accounts.spotify.com/api/token";
  const data = {
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  };
  const formData = formDataBuilder(data);
  const options = {
    headers: {
      Authorization:
        "Basic " + Buffer.from(c_id + ":" + c_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Content-Length": formData.length,
    },
  };

  axios
    .post(refreshUrl, formData.toString(), options)
    .then((response) => {
      if (response.status === 200) {
        const access_token = data.access_token;
        console.log(response.data);
        res.cookie("access_token", access_token, {
          expires: new Date(Date.now() + 60 * 60 * 1000),
        });
        res.status(200);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(401);
    });
};

module.exports = {
  login: login,
  callback: callback,
  refreshToken: refreshToken,
};
