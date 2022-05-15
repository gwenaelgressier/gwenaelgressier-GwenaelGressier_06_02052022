const { User } = require("../mongo");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
    const { email, password } = req.body; // egale a const email = req.body.email; et const password = req.body.password;

    const hashedPassword = await hashPassword(password);

    const user = new User({ email, password: hashedPassword }); //egale a email:email et password:password

    user.save()
        .then(() => res.status(201).send({ message: "User created" }))
        .catch((err) =>
            res.status(409).send({ message: "User pas enregisté " + err })
        );
}

function hashPassword(password) {
    const saltRound = 10;
    return bcrypt.hash(password, saltRound);
}

async function logUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ emai: email });
    const isPasswordOK = await bcrypt.compare(password, user.password);
    if (!isPasswordOK) {
        return res.status(403).send({ message: "Invalid password" });
    }
    return res.status(200).send({ message: "User logged in" });
}
//User.deleteMany({}).then(() => console.log("all removed"));//clear toute ma base de données
module.exports = { createUser, logUser }; //exporte de mes functions
