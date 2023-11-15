const Food = require("../models/food");

const getAllFoods = async (req, res) => {
    const { mealType, cuisineType, tag , q } = req.query;
    const queryObject = {};

    if(mealType){
        queryObject.mealType = { $regex: mealType, $options: "i" };
    }

    if(cuisineType){
        queryObject.cuisineType = cuisineType;
    }

    if(tag){
        queryObject.tag = tag;
    }

    if(q){
        queryObject.label = { $regex: q, $options: "i" };
    }

    let apiData = Food.find(queryObject);

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    let skip = (page -1) * limit;

    apiData.skip(skip).limit(limit);

    const foods = await apiData;
    res.status(200).json({ foods });
};

const getAllFoodsTesting = async (req, res) => {
    const foods = await Food.find(req.query).select("name");
    res.status(200).json({ foods });
};

module.exports = { getAllFoods, getAllFoodsTesting };