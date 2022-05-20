const { app, express } = require("./server");
const port = 3000;
const path = require("path");

//conection to database
require("./mongo");

//controllerss
const { createUser, logUser } = require("./controllers/users.js");
const {
    getSauces,
    createSauce,
    getSaucesById,
} = require("./controllers/sauces.js");

//middleware
const { upload } = require("./middleware/multer");
const { authenticateUser } = require("./middleware/auth.js");

//Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authenticateUser, getSauces);
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce);
app.get("/api/sauces/:id", authenticateUser, getSaucesById); //passer le params dans le id
app.get("/", (req, res) => {
    res.send("Hello World!");
});

//listen
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
