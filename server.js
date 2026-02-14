import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";

// App Config

const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// api endpoint
app.use('/api/user',userRouter)

app.get("/", (req, res) => {
  res.send("API Is working ");
});

app.listen(port, () => {
  console.log("Serveris running on Port : ", +port);
});
