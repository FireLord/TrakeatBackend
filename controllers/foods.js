require("dotenv").config();

const Food = require("../models/food");
const PORT = process.env.PORT || 5000;
const URL = process.env.HOST_URL

const getImageURL = imageName => {
    return `${URL}/food/img/${imageName}.jpg`;
};

const getAllFoods = async (req, res) => {
    try {
        const { mealType, cuisineType, tag, q, dietLabels, random } = req.query;
        const queryObject = {};
        let healthLabels = req.query.healthLabels;

        if (mealType) {
            queryObject.mealType = { $regex: mealType, $options: "i" };
        }

        if (cuisineType) {
            queryObject.cuisineType = { $in: cuisineType.split(",") };
        }

        if (tag) {
            queryObject.tag = tag;
        }

        const regex = /(chicken|meat|egg|lamb|fish|beef|pork|dhansak)/i;

        let labelQuery;

        if (healthLabels) {
            healthLabels = healthLabels.split(",")
            if (healthLabels.includes('NonVegetarian')) {
                // Check for non-veg items based on specific terms in the label
                labelQuery = { $regex: regex.source, $options: regex.flags };

                let tempHealthLabels = healthLabels.filter(hl => hl !== "NonVegetarian");

                // Exclude items with 'Vegetarian' tag in healthLabels for non-veg
                queryObject.healthLabels = { $nin: ['Vegetarian', 'Vegan'], ...(tempHealthLabels.length ? { $in: healthLabels } : {}) };
            } else if (healthLabels.includes('Vegetarian')) {
                // Check for vegetarian items based on the absence of non-vegetarian terms in the label
                labelQuery = { $not: { $regex: regex.source, $options: regex.flags } };

                // Include items with 'Vegetarian' tag in healthLabels for vegetarian
                queryObject.healthLabels = { $in: [...healthLabels, ...['Vegetarian', 'Vegan']] };
            } else {
                queryObject.healthLabels = { $in: healthLabels };
            }
        }

        if (dietLabels) {
            queryObject.dietLabels = { $in: dietLabels.split(",") };
        }

        if (q) {
            if (labelQuery) {
                queryObject.$and = [
                    {
                        "label": labelQuery
                    },
                    {
                        "label": { "$regex": q, "$options": "i" }
                    }
                ];
            } else {
                queryObject.label = { "$regex": q, "$options": "i" }
            }
        } else {
            labelQuery && (queryObject.label = labelQuery)
        }

        let apiData;

        if (random === 'true') {
            apiData = Food.aggregate([{ $match: queryObject }, { $sample: { size: 2000 } }]);
        } else {
            apiData = Food.find(queryObject).lean();
        }

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;

        let skip = (page - 1) * limit;

        apiData.skip(skip).limit(limit);

        const foods = await apiData;

        // Map each food item to include the full image URL
        const foodsWithImageURLs = foods.map(food => ({
            ...food._doc || food,
            image: getImageURL(food._id),
        }));

        res.status(200).json({ foods: foodsWithImageURLs });
    } catch (error) {
        console.error(error);
    }
};

const getAllFoodsTesting = async (req, res) => {
    const foods = await Food.find(req.query).select("name");
    res.status(200).json({ foods });
};

module.exports = { getAllFoods, getAllFoodsTesting };
