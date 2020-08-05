const express = require("express");
const dotenv = require("dotenv");
const users = require("./routers/users");
const book = require("./routers/book");

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.json());

app.use("/api/v1/users", users);
app.use("/api/v1/book", book);

const PORT = process.env.PORT;

app.listen(
    PORT,
    console.log(`Server running`)
);