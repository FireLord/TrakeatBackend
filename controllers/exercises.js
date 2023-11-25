const Exercise = require("../models/exercise");

const getAllExercises = async (req, res) => {
    const queryObject = {};

    let apiData = Exercise.find(queryObject);

    const exercises = await apiData;
    res.status(200).json({ exercises });
};

const getAllExercisesTesting = async (req, res) => {
    const exercises = await Exercise.find(req.query).select("name");
    res.status(200).json({ exercises });
};

module.exports = { getAllExercises, getAllExercisesTesting };