const Exercise = require("../models/exercise");
const { ObjectId } = require('mongodb');

const getAllExercises = async (req, res) => {
    try {
        const { exerciseId } = req.query;
        const queryObject = [];

        if (exerciseId) {
            queryObject.push({ $match: { _id: new ObjectId(exerciseId) } });
        } else {
            queryObject.push({ $skip: 0 });
        }

        let apiData = Exercise.aggregate(queryObject);

        const exercises = await apiData;
        res.status(200).json({ exercises });
    } catch (error) {
        console.error(error);
    }
};

const getAllExercisesTesting = async (req, res) => {
    const exercises = await Exercise.find(req.query).select("name");
    res.status(200).json({ exercises });
};

module.exports = { getAllExercises, getAllExercisesTesting };