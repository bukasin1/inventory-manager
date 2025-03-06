import cron from "node-cron";
import { prisma } from "./prismaClient";

export const clearExpiredInventory = async () => {
  try {
    const now = Date.now();
    console.log("Starting cleanup of expired inventory: ", new Date(now));
    await prisma.inventory.deleteMany({ where: { expiry: { lte: now } } });
    console.log("Expired inventory cleared");
  } catch (e) {
    console.log("Error occured during cleanup");
  }
};

// Run cleanup every hour
cron.schedule("0 * * * *", clearExpiredInventory);

console.log("Cron job initialized");
