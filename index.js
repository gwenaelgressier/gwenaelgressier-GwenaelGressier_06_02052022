const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

//Middleware
app.use(cors()); //Le CORS permet de prendre en charge des requêtes multi-origines sécurisées et des transferts de données entre le navigateurs et le serveurs web

//Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
