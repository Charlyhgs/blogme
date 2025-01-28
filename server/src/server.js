const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Successfully connected to the database.");
  })
  .catch((err) => {
    console.error("Cannot connect to database:", err);
  });

app.get("/", (req, res) => {
  res.send("Working server !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listenning on port: ${PORT}`);
});
