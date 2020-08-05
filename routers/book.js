const express = require("express");
const auth = require("../middleware/auth");

const {
    getbooks,
    borrowbook,
    getborrowbooks

} = require("../controllers/book");

const router = express.Router();

router.route("/").get(getbooks);
router.route("/borrow").post(auth, borrowbook);
router.route("/borrowed").get(getborrowbooks);


module.exports = router;