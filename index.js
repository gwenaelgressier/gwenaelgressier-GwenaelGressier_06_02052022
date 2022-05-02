const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

//database

const mongoose = require("mongoose");
const paswords = "3zxRc48PmAjWQBJx";

const uri = `mongodb+srv://gwen:${paswords}@cluster0.odhgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("errore conecting mongo:", err));

//Middleware
app.use(cors()); //Le CORS permet de prendre en charge des requêtes multi-origines sécurisées et des transferts de données entre le navigateurs et le serveurs web
app.use(express.json()); //Permet de parser les requêtes en JSON

//Routes
app.post("/api/auth/signup", (req, res) => {
  console.log("Signup request:", req.body); //body =payload
  res.send({ message: "User created" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
