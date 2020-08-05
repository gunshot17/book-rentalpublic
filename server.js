const express = require("express");
const dotenv = require("dotenv");
const users = require("./routers/users");

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.json());

app.use("/api/v1/users", users);

const PORT = process.env.PORT;

app.listen(
    PORT,
    console.log(`Server running`)
);