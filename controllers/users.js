const { User } = require("../mongo");

function createUser(req, res) {
  const { email, password } = req.body; // egale a const email = req.body.email; et const password = req.body.password;
  const user = new User({ email, password }); //egale a email:email et password:password

  user
    .save()
    .then(() => res.send({ message: "User created" }))
    .catch((err) => console.log(`${email} pas enregistre`, err));
}

module.exports = { createUser };
