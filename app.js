require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");

const PORT = process.env.PORT || 5000;

const exercises_routes = require("./routes/exercises");
const foods_routes = require("./routes/foods");

// Middleware to check API key
const checkApiKey = (req, res, next) => {
  const providedKey = req.headers['x-api-key'];
  const apiKey = process.env.API_KEY;

  if (providedKey === apiKey) {
    next(); // API key is valid, proceed to the next middleware or route handler
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
};

app.get("/", (req, res) => {
  res.send("Hi, I am live");
});
app.use("/food/img", express.static(__dirname + '/data/food_img'));

// Apply middleware
app.use(checkApiKey);

app.use("/api/exercises", exercises_routes);
app.use("/api/foods", foods_routes);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`${PORT} Yes I am connected`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
