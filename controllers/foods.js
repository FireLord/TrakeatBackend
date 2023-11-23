require("dotenv").config();

const Food = require("../models/food");
const PORT = process.env.PORT || 5000;
const URL = process.env.HOST_URL

const getImageURL = imageName => {
    return `${URL}/food/img/${imageName}.jpg`;
};

const getAllFoods = async (req, res) => {
    const { mealType, cuisineType, tag , q , healthLabels, dietLabels } = req.query;
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

    if(healthLabels){
        queryObject.healthLabels = healthLabels;
    }

    if(dietLabels){
        queryObject.dietLabels = dietLabels;
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
    
    // Map each food item to include the full image URL
    const foodsWithImageURLs = foods.map(food => ({
        ...food._doc,
        image: getImageURL(food._id),
    }));

    res.status(200).json({ foods: foodsWithImageURLs });
};

const getAllFoodsTesting = async (req, res) => {
    const foods = await Food.find(req.query).select("name");
    res.status(200).json({ foods });
};

module.exports = { getAllFoods, getAllFoodsTesting };
