const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const paswords = process.env.DB_PASSWORDS; //se conecter à la base de données avec la variable d'environnement
const userName = process.env.DB_USERNAME;
const db = process.env.DB_NAME;
let uri;

//sert a gerer mon projet dans ses diferente phase actuellement le projet et en developement donc nous seront dans le cas du else
if (process.env.NODE_ENV === "production") {
    uri = "http://la_vraie_url_de_mongo";
} else {
    uri = `mongodb+srv://${userName}:${paswords}@cluster0.odhgv.mongodb.net/${db}?retryWrites=true&w=majority`;
}

mongoose
    .connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("errore conecting mongo:", err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = { mongoose, User };
