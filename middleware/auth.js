const jwt = require("jsonwebtoken");

/**
 * function qui permet la verification des token
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function authenticateUser(req, res, next) {
    console.log("authenticate user");
    const header = req.header("Authorization");
    if (header == null) return res.status(403).send({ message: "Invalid" });

    const token = header.split(" ")[1];
    if (token == null)
        return res.status(403).send({ message: "Token cannot be null" });

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err)
            return res.status(403).send({ message: "Token invalid " + err });
        console.log("the token is valid, we continue");
        next();
    });
}

module.exports = { authenticateUser };
