import express from 'express';
import cors from "cors";
import inventoryRoutes from "./routes/inventory.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/inventory", inventoryRoutes);

export default app;
