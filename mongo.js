const mongoose = require("mongoose");
const paswords = "3zxRc48PmAjWQBJx";

const uri = `mongodb+srv://gwen:${paswords}@cluster0.odhgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("errore conecting mongo:", err));
