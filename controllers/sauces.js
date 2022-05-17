//mes require
const { handle } = require("express/lib/router");
const mongoose = require("mongoose");

const producSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    userLiked: [String],
    userDisliked: [String],
});

const Product = mongoose.model("product", producSchema);

function getSauces(req, res) {
    console.log("test");
    Product.find({}).then((products) => res.send(products));
}
//creation de la sauce
function createSauce(req, res) {
    const name = req.body.name;
    const manufacturer = req.body.manufacturer;
    console.log({ body: req.body });
    const product = new Product({
        userId: "test",
        name: "test",
        manufacturer: "test",
        description: "test",
        mainPepper: "test",
        imageUrl: "test",
        heat: 2,
        likes: 2,
        dislikes: 2,
        userLiked: ["test"],
        userDisliked: ["test"],
    });
    product
        .save()
        .then((res) => console.log("product saved", res))
        .catch(console.error);
}

module.exports = { getSauces, createSauce };
