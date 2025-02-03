const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
const routes = require("./routes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// uncomment to reset DB
// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Database synchronized");
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });

app.get("/", (req, res) => {
  res.send("Working server !");
});

routes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listenning on port: ${PORT}`);
});
