const mongoose = require("mongoose");
const { unlink } = require("fs/promises");
const jwt = require("jsonwebtoken");
//on inclut le module FyleSystem qui permet de travailler avec les fichiers
const fs = require("fs");

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: { type: Number, min: 1, max: 10 },
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String],
});
const Product = mongoose.model("Product", productSchema);

/**
 * function qui affiche toute les sauces de la base de données
 *
 * @param {*} req
 * @param {*} res
 */
function getSauces(req, res) {
    Product.find({})
        .then((products) => res.status(200).send(products))
        .catch((error) => res.status(500).send(error));
}

/**
 * function qui recupere l'id d'une sauce
 *
 * @param {*} req
 * @param {*} res
 * @returns Product.findById(id)
 */
function getSauce(req, res) {
    const { id } = req.params;
    return Product.findById(id);
}

/**
 * function qui afficher la sauce selectioner par l'utilisateur
 *
 * @param {*} req
 * @param {*} res
 */
function getSauceById(req, res) {
    getSauce(req, res)
        .then((product) => sendClientResponse(product, res))
        .catch((err) => res.status(500).send(err));
}

/**
 * function qui supprime une sauce de la base de données
 *
 * @param {*} req
 * @param {*} res
 */
function deleteSauce(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);
    const userId = decodedToken.id;
    console.log(decodedToken.id);

    Product.findOne({ _id: req.params.id })
        .then((product) => {
            console.log(product.userId === userId);
            //si userId est le meme que celui qui a créé la sauce
            if (product.userId === userId) {
                const imageToDelete = product.imageUrl.split("/");
                let img = imageToDelete.slice(-1).pop();
                fs.unlink(`images/${img}`, () => {
                    Product.deleteOne({ _id: req.params.id })
                        .then(() =>
                            res
                                .status(200)
                                .json({ message: "Sauce supprimé !" })
                        )
                        .catch((error) => res.status(400).json({ error }));
                });
            } else {
                //si userId different
                res.status(403).json({ message: "Requête non autorisée !" });
            }
        })
        .catch((error) => res.status(500).json({ error }));
}

/**
 * function qui me permet la modification de la sauce
 * @param {*} req
 * @param {*} res
 */
function modifySauce(req, res) {
    const {
        params: { id },
    } = req;

    const hasNewImage = req.file != null;
    const payload = makePayload(hasNewImage, req);
    Product.findByIdAndUpdate(id, payload)
        .then((dbResponse) => sendClientResponse(dbResponse, res))
        .then((product) => {
            if (hasNewImage == true) deleteImage(product);
        })
        .then((res) => console.log("FILE DELETED", res))
        .catch((err) => console.error("PROBLEM UPDATING", err));
}

/**
 * function qui permet la supression de l'image dans nos fichier
 *
 * @param {*} product
 * @returns
 */
function deleteImage(product) {
    if (product == null) return;
    console.log("DELETE IMAGE", product);
    const imageToDelete = product.imageUrl.split("/");
    let img = imageToDelete.slice(-1).pop();
    return unlink("images/" + img);
}

/**
 * function qui permet de gerer la modification de mon image
 * @param {*} hasNewImage
 * @param {*} req
 * @returns
 */
function makePayload(hasNewImage, req) {
    console.log("hasNewImage:", hasNewImage);
    if (!hasNewImage) return req.body;
    const payload = JSON.parse(req.body.sauce);
    payload.imageUrl = makeImageUrl(req, req.file.fileName);
    console.log("NEW IMAGE TO MANAGE");
    console.log("the payload:", payload);
    return payload;
}

/**
 * function de verifications
 *
 * @param {*} product
 * @param {*} res
 * @returns Promise.resolve
 */
function sendClientResponse(product, res) {
    if (product == null) {
        console.log("NOTHING TO UPDATE");
        return res
            .status(404)
            .send({ message: "Object not found in database" });
    }
    console.log("ALL GOOD, UPDATING:", product);
    return Promise.resolve(res.status(200).send(product)).then(() => product);
}

/**
 * function qui cree url de mon image
 *
 * @param {*} req
 * @param {*} fileName
 * @returns l url de mon image
 */
function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

/**
 * function qui sert a la creation de mes sauces
 *
 * @param {*} req
 * @param {*} res
 */
function createSauce(req, res) {
    const { body, file } = req;
    const { fileName } = file;
    const sauce = JSON.parse(body.sauce);
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce;

    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, fileName),
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    product
        .save()
        .then((message) => res.status(201).send({ message }))
        .catch((err) => res.status(500).send(err));
}

/**
 * function qui permet de liker une sauce
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
function likeSauce(req, res) {
    const { like, userId } = req.body;
    if (![1, -1, 0].includes(like))
        return res.status(403).send({ message: "Invalid like value" });

    getSauce(req, res)
        .then((product) => updateVote(product, like, userId, res))
        .then((pr) => pr.save())
        .then((prod) => sendClientResponse(prod, res))
        .catch((err) => res.status(500).send(err));
}

/**
 * function qui permet de modifier le like
 *
 * @param {*} product
 * @param {*} like
 * @param {*} userId
 * @param {*} res
 * @returns
 */
function updateVote(product, like, userId, res) {
    if (like === 1 || like === -1) return incrementVote(product, userId, like);
    return resetVote(product, userId, res);
}

/**
 * function qui reset le like
 *
 * @param {*} product
 * @param {*} userId
 * @param {*} res
 * @returns
 */
function resetVote(product, userId, res) {
    const { usersLiked, usersDisliked } = product;
    if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
        return Promise.reject("User seems to have voted both ways");

    if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
        return Promise.reject("User seems to not have voted");

    if (usersLiked.includes(userId)) {
        --product.likes;
        product.usersLiked = product.usersLiked.filter((id) => id !== userId);
    } else {
        --product.dislikes;
        product.usersDisliked = product.usersDisliked.filter(
            (id) => id !== userId
        );
    }

    return product;
}

/**
 * function qui incremente les likes et dilikes
 *
 * @param {*} product
 * @param {*} userId
 * @param {*} like
 * @returns
 */
function incrementVote(product, userId, like) {
    const { usersLiked, usersDisliked } = product;

    const votersArray = like === 1 ? usersLiked : usersDisliked;
    if (votersArray.includes(userId)) return product;
    votersArray.push(userId);

    like === 1 ? ++product.likes : ++product.dislikes;
    return product;
}

module.exports = {
    sendClientResponse,
    getSauce,
    getSauces,
    createSauce,
    getSauceById,
    deleteSauce,
    modifySauce,
    likeSauce,
};
