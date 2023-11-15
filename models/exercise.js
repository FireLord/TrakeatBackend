const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    levels: [
      {
        level: {
          type: String,
          required: true,
        },
        calories_burned_half_hour: {
          type: Number,
          required: true,
        },
      },
    ],
}, { versionKey: false });

module.exports = mongoose.model('Exercise', exerciseSchema);