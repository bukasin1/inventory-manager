import express from 'express';
import cors from "cors";
import inventoryRoutes from "./routes/inventory.routes";
import "./utils/dbCleanup";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/inventory", inventoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
