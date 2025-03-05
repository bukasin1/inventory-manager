import express from "express";
import {
  addItem,
  getQuantity,
  sellItem,
} from "../controllers/inventory.controller";

const router = express.Router();

router.post("/:item/add", addItem);
router.post("/:item/sell", sellItem);
router.get("/:item/quantity", getQuantity);

export default router;
