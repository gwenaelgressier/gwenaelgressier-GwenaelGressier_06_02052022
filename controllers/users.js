//mes require
const { User } = require("../mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * fonction qui crée un nouvel utilisateur
 *
 * @param {*} req
 * @param {*} res
 */
async function createUser(req, res) {
    try {
        const { email, password } = req.body; // egale a const email = req.body.email; et const password = req.body.password;

        const hashedPassword = await hashPassword(password);

        const user = new User({ email, password: hashedPassword }); //egale a email:email et password:password

        await user.save();
        res.status(201).send({ message: "Utilisateur enregisté :" });
    } catch (err) {
        res.status(409).send({ message: "Utilisateur pas enregisté " + err });
    }
}

/**
 * fontion qui hash le mot de passe
 *
 * @param {string} password
 */
function hashPassword(password) {
    const saltRound = 10;
    return bcrypt.hash(password, saltRound);
}

/**
 * fonction qui verifie si le mot de passe est correct
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function logUser(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ emai: email });
        const isPasswordOK = await bcrypt.compare(password, user.password);
        if (!isPasswordOK) {
            res.status(403).send({ message: "Mot de passe incorrect" });
        }
        const token = createToken(email);
        res.status(200).send({ userId: user?._id, token: token });
    } catch (err) {
        res.status(500).send({ message: "Erreur interne" });
    }
}

//fonction de creation du token
function createToken(email) {
    const jwtPassword = process.env.JWT_PASSWORD;
    return jwt.sign({ email: email }, jwtPassword, {
        expiresIn: "1h",
    });
}

//User.deleteMany({}).then(() => console.log("all removed"));//clear toute ma base de données
module.exports = { createUser, logUser }; //exporte de mes functions
