const express = require("express");
const spotify = require("../controllers/spotifyAuthController");
const router = express.Router();

router.get("/login", (_req, res) => {
  spotify.login(res);
});

router.get("/callback", (req, res) => {
  spotify.callback(req, res);
});

router.get("/refresh_token", (req, res) => {
  spotify.refreshToken(req, res);
});

module.exports = router;
