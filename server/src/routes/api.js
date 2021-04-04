const express = require("express");
const loginController = require("../controllers/loginController");
const router = express.Router();

router.get("/login", (_req, res) => {
  loginController.login(res);
});

router.get("/callback", (req, res) => {
  loginController.callback(req, res);
});

module.exports = router;
