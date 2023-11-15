require("dotenv").config();
const express = require("express");
const app = req = express();
const connectDB = require("./db/connect");

const PORT = process.env.PORT || 5000;

const exercises_routes = require("./routes/exercises")

app.get("/",(req, res) => {
    res.send("Hi, I am live");
});

app.use("/api/exercises", exercises_routes);

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`${PORT} Yes I am connected`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();