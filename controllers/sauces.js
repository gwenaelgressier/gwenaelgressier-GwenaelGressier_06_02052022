//mes require
const mongoose = require("mongoose");

const producSchema = new mongoose.Schema({
    userId: { type: String },
    name: { type: String },
    manufacturer: { type: String },
    description: { type: String },
    mainPepper: { String },
    imageUrl: String,
    heat: { type: Number, min: 1, max: 10 },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: [String],
    usersDisliked: [String],
});

const Product = mongoose.model("Product", producSchema);

function getSauces(req, res) {
    Product.find({})
        .then((products) => res.send(products))
        .catch((error) => res.status(500).send(error));
}

function getSaucesById(req, res) {
    const _id = req.params.id;
    console.log("id", _id);
    Product.findById(_id)
        .then((product) => res.send(product))
        .catch((err) => res.status(500).send(err));
}

//creation de la sauce
function createSauce(req, res) {
    const { body, file } = req;

    const { filename } = file;

    const sauce = JSON.parse(body.sauce);

    const { name, manufacturer, description, mainPepper, heat, userId } = sauce;

    function makeImageUrl(req, filename) {
        return req.protocol + "://" + req.get("host") + "/images/" + filename;
    }

    const product = new Product({
        userId,
        name,
        manufacturer,
        description,
        mainPepper,
        imageUrl: makeImageUrl(req, filename),
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    product
        .save()
        .then((message) => {
            res.status(201).send({ message: message });
            return console.log("product enregistré", message);
        })
        .catch(console.error);
}

module.exports = { getSauces, createSauce, getSaucesById };
