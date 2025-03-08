import express from "express";
import cors from "cors";
import dbConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import fileUpload from "express-fileupload";
import cloudinaryConnect from "./config/cloudinary.js"

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

dbConnection();

cloudinaryConnect()


app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/product", productRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


