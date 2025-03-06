import { clearExpiredInventory } from "../utils/dbCleanup";
import { prisma } from "../utils/prismaClient";

beforeAll((done) => {
  // Ensure a clean database before starting each test
  prisma.inventory.deleteMany().then(() => {
    done();
  });
});

afterAll((done) => {
  // Disconnect prisma after tests done
  clearExpiredInventory().then(() => {
    prisma.$disconnect().then(() => {
      done();
    });
  });
});
