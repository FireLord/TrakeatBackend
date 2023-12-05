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
        const queryObject = [];
        let healthLabels = req.query.healthLabels;

        if (mealType) {
            queryObject.push({ $match: { mealType: { $regex: mealType, $options: "i" } } });
        }

        if (cuisineType) {
            queryObject.push({ $match: { cuisineType: { $in: cuisineType.split(",") } } });
        }

        if (tag) {
            queryObject.push({ $match: { tag } });
        }

        const regex = /(chicken|meat|egg|lamb|fish|beef|pork|dhansak)/i;

        let labelQuery;

        if (healthLabels) {
            healthLabels = healthLabels.split(",");

            if (healthLabels.includes('NonVegetarian')) {
                // Check for non-veg items based on specific terms in the label
                labelQuery = { $regex: regex.source, $options: regex.flags };

                let tempHealthLabels = healthLabels.filter(hl => hl !== "NonVegetarian");

                // Exclude items with 'Vegetarian' tag in healthLabels for non-veg
                queryObject.push({
                    $match: {
                        healthLabels: {
                            $nin: ['Vegetarian', 'Vegan'],
                            ...(tempHealthLabels.length ? { $in: healthLabels } : {})
                        }
                    }
                });
            } else if (healthLabels.includes('Vegetarian')) {
                // Check for vegetarian items based on the absence of non-vegetarian terms in the label
                labelQuery = { $not: { $regex: regex.source, $options: regex.flags } };

                // Include items with 'Vegetarian' tag in healthLabels for vegetarian
                queryObject.push({
                    $match: {
                        healthLabels: { $in: [...healthLabels, ...['Vegetarian', 'Vegan']] }
                    }
                });
            } else {
                queryObject.push({ $match: { healthLabels: { $in: healthLabels } } });
            }
        }

        if (dietLabels) {
            queryObject.push({ $match: { dietLabels: { $in: dietLabels.split(",") } } });
        }

        if (q) {
            if (labelQuery) {
                queryObject.push({
                    $match: {
                        $and: [
                            { "label": labelQuery },
                            { "label": { "$regex": q, "$options": "i" } }
                        ]
                    }
                });
            } else {
                queryObject.push({ $match: { label: { "$regex": q, "$options": "i" } } });
            }
        } else {
            labelQuery && queryObject.push({ $match: { label: labelQuery } });
        }

        if (random === 'true') {
            queryObject.push({ $sample: { size: 2000 } });
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        queryObject.push({ $skip: skip });
        queryObject.push({ $limit: limit });

        queryObject.push({
            $addFields: {
                image: { $concat: [`${URL}/food/img/`, { $toString: "$_id" }, '.jpg'] },
            },
        });

        const foods = await Food.aggregate(queryObject);

        res.status(200).json({ foods });
    } catch (error) {
        console.error(error);
    }
};

const getAllFoodsTesting = async (req, res) => {
    const foods = await Food.find(req.query).select("name");
    res.status(200).json({ foods });
};

module.exports = { getAllFoods, getAllFoodsTesting };
