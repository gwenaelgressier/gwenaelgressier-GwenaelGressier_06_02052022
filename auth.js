const jwt = require("jsonwebtoken");

//verifie la conection et le token
function authenticateUser(req, res, next) {
    const header = req.header("Authorization");
    if (header == null)
        return res.status(403).send({ message: "Vous n'êtes pas connecté" });

    const token = header.split(" ")[1];
    if (token == null) return res.status(403).send({ message: "token null" });

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err)
            return res.status(403).send({ message: "Token invalie" + err });
        console.log("Le token est bien valide, on continue");
        next();
    });
}

module.exports = { authenticateUser };
