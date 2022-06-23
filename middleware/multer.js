const multer = require("multer");

const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb) {
        cb(null, makeFilename(req, file));
    },
});

/**
 * function qui permet cree le nommage unique de l'image
 *
 * @param {*} req
 * @param {*} file
 * @returns
 */
function makeFilename(req, file) {
    console.log("req, file:", file);
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-");
    file.fileName = fileName;
    return fileName;
}
const upload = multer({ storage });

module.exports = { upload };
