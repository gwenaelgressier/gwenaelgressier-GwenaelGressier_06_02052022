//mes require
const mongoose = require("mongoose");
const { unlink } = require("fs/promises");

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
    const id = req.params.id;
    console.log("id", id);
    Product.findById(id)
        .then((product) => res.send(product))
        .catch((err) => res.status(500).send(err));
}

function deleteSauces(req, res) {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
        .then((product) => deleteImage(product))
        .then((product) => res.send(product))
        .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(product) {
    const imageUrl = product.imageUrl;
    console.log(imageUrl);
    const imageToDelete = `images/${imageUrl.split("/").at(-1)}`;
    console.log(imageToDelete);
    unlink(imageToDelete, (err) => {
        if (err) {
            console.log(err);
        }
    });
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

module.exports = { getSauces, createSauce, getSaucesById, deleteSauces };
