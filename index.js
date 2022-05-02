const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

//conection to database
require("./mongo.js");
//controller
const { createUser } = require("./controllers/users.js");
//Middleware
app.use(cors()); //Le CORS permet de prendre en charge des requêtes multi-origines sécurisées et des transferts de données entre le navigateurs et le serveurs web
app.use(express.json()); //Permet de parser les requêtes en JSON

//Routes
app.post("/api/auth/signup", createUser);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
