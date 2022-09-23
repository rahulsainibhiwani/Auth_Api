import colors from "colors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { connectDB } from "./mongoDB.js";
import userRoute from "./Routes/userRoute.js";
dotenv.config();
const app = express();
app.use(express.json());

app.use("/user", userRoute);

app.use(notFound);
app.use(errorHandler);
connectDB();

const port = process.env.PORT || 7284;
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`.yellow.bold);
});
