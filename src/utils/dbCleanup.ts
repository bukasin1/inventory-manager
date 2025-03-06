import cron from "node-cron";
import { prisma } from "./prismaClient";

export const clearExpiredInventory = async () => {
  try {
    const now = Date.now();
    await prisma.inventory.deleteMany({ where: { expiry: { lte: now } } });
  } catch (e) {
    console.log("Error occured during cleanup");
  } finally {
    console.log("Expired inventory cleared");
  }
};

export const scheduleCleanupCron = () => {
  // Run cleanup every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Starting cleanup of expired inventory: ", new Date());
    await clearExpiredInventory();
  });
  console.log("Cron job initialized");
};
