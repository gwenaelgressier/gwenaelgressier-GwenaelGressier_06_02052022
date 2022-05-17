require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

//conection to database
require("./mongo.js");
//controller
const { createUser, logUser } = require("./controllers/users.js");
const { getSauces, createSauce } = require("./controllers/sauces.js");
//Middleware
app.use(cors()); //Le CORS permet de prendre en charge des requêtes multi-origines sécurisées et des transferts de données entre le navigateurs et le serveurs web
app.use(express.json()); //Permet de parser les requêtes en JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { authenticateUser } = require("./middleware/auth.js");
const multer = require("multer");
const upload = multer().single("image");
//Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authenticateUser, getSauces);
app.post("/api/sauces", authenticateUser, upload, createSauce);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

//listen
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
