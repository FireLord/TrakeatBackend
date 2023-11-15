const mongoose = require('mongoose');

const nutrientSchema = new mongoose.Schema({
  _id: false,
  label: String,
  quantity: Number,
  unit: String,
});

const foodSchema = new mongoose.Schema({
  label: String,
  image: String,
  url: String,
  yield: Number,
  ingredientLines: [String],
  cuisineType: [String],
  mealType: [String],
  totalNutrients: {
    ENERC_KCAL: nutrientSchema,
    FAT: nutrientSchema,
    FASAT: nutrientSchema,
    FATRN: nutrientSchema,
    FAMS: nutrientSchema,
    FAPU: nutrientSchema,
    CHOCDF: nutrientSchema,
    "CHOCDF.net": nutrientSchema,
    FIBTG: nutrientSchema,
    SUGAR: nutrientSchema,
    "SUGAR.added": nutrientSchema,
    PROCNT: nutrientSchema,
    CHOLE: nutrientSchema,
    NA: nutrientSchema,
    CA: nutrientSchema,
    MG: nutrientSchema,
    K: nutrientSchema,
    FE: nutrientSchema,
    ZN: nutrientSchema,
    P: nutrientSchema,
    VITA_RAE: nutrientSchema,
    VITC: nutrientSchema,
    THIA: nutrientSchema,
    RIBF: nutrientSchema,
    NIA: nutrientSchema,
    VITB6A: nutrientSchema,
    FOLDFE: nutrientSchema,
    FOLFD: nutrientSchema,
    FOLAC: nutrientSchema,
    VITB12: nutrientSchema,
    VITD: nutrientSchema,
    TOCPHA: nutrientSchema,
    VITK1: nutrientSchema,
    WATER: nutrientSchema,
  },
}, { versionKey: false });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;