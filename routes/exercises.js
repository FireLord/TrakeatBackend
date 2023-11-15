const express = require("express");
const router = express.Router();

const {
    getAllExercises,
    getAllExercisesTesting
} = require("../controllers/exercises");

router.route("/").get(getAllExercises);
router.route("/testing").get(getAllExercisesTesting);

module.exports = router;