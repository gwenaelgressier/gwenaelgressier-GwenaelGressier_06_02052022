//mes require
const { handle } = require("express/lib/router");
const jwt = require("jsonwebtoken");
//functions pour recuperer le token
function getSauces(req, res) {
    const header = req.header("Authorization");
    if (header == null)
        return res.status(403).send({ message: "Vous n'êtes pas connecté" });

    const token = header.split(" ")[1];
    if (token == null) return res.status(403).send({ message: "token null" });

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) =>
        handleToken(err, decoded, res)
    );
}

function handleToken(err, decoded, res) {
    if (err) res.status(403).send({ message: "Token invalie" + err });
    else {
        console.log("le token est valide", decoded);
        res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] });
    }
}

module.exports = { getSauces };
