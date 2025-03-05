import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";

// Add Item Lot
export const addItem = async (req: Request, res: Response) => {
  try {
    const { item } = req.params;
    const { quantity, expiry } = req.body;
  
    if (!quantity || !expiry) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
  
    await prisma.inventory.create({
      data: { itemName: item, quantity, expiry },
    });
  
    res.status(201).json({});
  } catch (e) {
    res.status(400).json({ error: "Something went wrong" });
  }
};

// Get Available Quantity
export const getQuantity = async (req: Request, res: Response) => {
  const { item } = req.params;
  const now = Date.now();

  const lots = await prisma.inventory.findMany({
    where: { itemName: item, expiry: { gt: now } },
    orderBy: { expiry: "asc" },
  });

  const quantity = lots.reduce((sum: number, lot) => sum + lot.quantity, 0);
  const validTill = lots.length ? Number(lots[lots.length - 1].expiry) : null;

  res.json({ quantity, validTill });
};

// Sell Item
export const sellItem = async (req: Request, res: Response) => {
  const { item } = req.params;
  let { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ error: "Invalid quantity" });
    return;
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Step 1: Get the non-expired quantities of the item in the database
      const now = Date.now();
      const availableLots = await prisma.inventory.findMany({
        where: { itemName: item, expiry: { gt: now } },
        orderBy: { expiry: "asc" },
      });

      // Calculate total non-expired available quantity
      const totalAvailableQuantity = availableLots.reduce(
        (total, lot) => total + lot.quantity,
        0
      );

      // Step 2: Check if the available quantity is enough
      if (totalAvailableQuantity < quantity) {
        throw new Error("Insufficient stock to fulfill the request");
      }

      let remainingToSell = quantity;
      // Step 3: Deduct the required quantity from each lot in order of expiry
      for (const lot of availableLots) {
        if (remainingToSell <= 0) break;

        const quantityToSell = Math.min(lot.quantity, remainingToSell);

        if (lot.quantity <= remainingToSell) {
          await prisma.inventory.delete({ where: { id: lot.id } });
        } else {
          await prisma.inventory.update({
            where: { id: lot.id },
            data: { quantity: lot.quantity - quantityToSell },
          });
        }

        remainingToSell -= quantityToSell;
      }

      // If there's any remaining quantity to sell, throw an error (this shouldn't happen due to the check above)
      if (remainingToSell > 0) {
        throw new Error("Failed to update all lots. Something went wrong.");
      }
    });

    res.json({});
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
