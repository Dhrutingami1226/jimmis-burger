import express from 'express';
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import connectDb from "./config/db.mjs"
import cors from 'cors';

import registerRoutes from "./routes/register.mjs";
import loginRoutes from "./routes/login.mjs";
import forgotRoutes from "./routes/Forgotpass.mjs";
import franchiseRoutes from "./routes/franchise.mjs"
import carouselRoutes from "./routes/carousel.mjs";
import menuRoutes from "./routes/menu.mjs";
import offersRoutes from "./routes/offers.mjs";
import storeLocatorRoutes from "./routes/storelocator.mjs";

dotenv.config();
await connectDb();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175', 
  'http://localhost:3000', 
  'http://localhost:5000',
  'https://jimmi-backend.onrender.com'
];

// Add production frontend URL if it exists
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/register",registerRoutes);
app.use("/api/login",loginRoutes);
app.use("/api/forgot-pass", forgotRoutes);
app.use("/api/franchise", franchiseRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/stores", storeLocatorRoutes);
app.use("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


