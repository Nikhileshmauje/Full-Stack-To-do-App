import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/database.js";
import userRoute from "./routes/user.js";
import bodyParser from "body-parser";
import todoRoute from "./routes/todo.js";
import cookieParser from "cookie-parser";


const app = express();
dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

connectDB();

app.use("/api/v1/user", userRoute);
app.use("/api/v1/todo", todoRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Listening to port ${PORT}`);
})