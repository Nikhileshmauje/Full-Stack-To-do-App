import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/database.js";
import userRoute from "./routes/user.js";
import bodyParser from "body-parser";
import todoRoute from "./routes/todo.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

connectDB();

app.use("/api/v1/user", userRoute);
app.use("/api/v1/todo", todoRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
