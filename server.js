require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//Middleware
app.use(cors()); //Le CORS permet de prendre en charge des requêtes multi-origines sécurisées et des transferts de données entre le navigateurs et le serveurs web
app.use(express.json()); //Permet de parser les requêtes en JSON

module.exports = { app, express };
