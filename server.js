import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

// App Config

const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

app.use("/uploads", express.static("uploads"));

// Middleware
app.use(express.json());
app.use(cors());

// api endpoint
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

app.get("/", (req, res) => {
  res.send("API Is working ");
});

app.listen(port, () => {
  console.log("Serveris running on Port : ", +port);
});
