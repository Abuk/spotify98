const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const env_load = require("dotenv").config();
const routes = require("./routes/api");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 4000;

if (env_load.error) {
  console.log(".env not found");
  throw env_load.error;
}

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use("/api", routes);
app.use(cors());

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
