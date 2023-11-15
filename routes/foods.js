const express = require("express");
const router = express.Router();

const {
    getAllFoods,
    getAllFoodsTesting
} = require("../controllers/foods");

router.route("/").get(getAllFoods);
router.route("/testing").get(getAllFoodsTesting);

module.exports = router;