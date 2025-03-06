import request from "supertest";
import { prisma } from "../utils/prismaClient";
import app from "../app";

describe("Inventory API - Item: bar", () => {
  beforeAll(async () => {
    // Ensure a clean database before starting
    await prisma.inventory.deleteMany();
  });

  it("item bar - should correctly handle inventory addition, selling, and expiration", async () => {
    const item = "bar";
    const t0 = Date.now();

    async function waitUntil(targetTime: number) {
      const now = Date.now();
      const remainingTime = targetTime - now;
      if (remainingTime > 0) {
        await new Promise((r) => setTimeout(r, remainingTime));
      }
    }

    // 1. t=t0, Add 10 items expiring at t0 + 10000
    await request(app)
      .post(`/inventory/${item}/add`)
      .send({ quantity: 10, expiry: t0 + 10000 })
      .expect(201);

    // 2. t=t0+1000, Add 10 more items expiring at t0 + 15000
    await waitUntil(t0 + 1000);
    await request(app)
      .post(`/inventory/${item}/add`)
      .send({ quantity: 10, expiry: t0 + 15000 })
      .expect(201);

    // 3. t=t0+2000, Add 10 more items expiring at t0 + 20000
    await waitUntil(t0 + 2000);
    await request(app)
      .post(`/inventory/${item}/add`)
      .send({ quantity: 10, expiry: t0 + 20000 })
      .expect(201);

    // 4. t=t0+3000, Check total quantity (30), validTill = t0 + 10000
    await waitUntil(t0 + 3000);
    let res = await request(app).get(`/inventory/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 30, validTill: t0 + 10000 });

    // 5. t=t0+5000, Sell 5 items
    await waitUntil(t0 + 5000);
    await request(app)
      .post(`/inventory/${item}/sell`)
      .send({ quantity: 5 })
      .expect(200);

    // 6. t=t0+7000, Check quantity (25), validTill still t0 + 10000
    await waitUntil(t0 + 7000);
    res = await request(app).get(`/inventory/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 25, validTill: t0 + 10000 });

    // 7. t=t0+10000, Check quantity (20), validTill = t0 + 15000 (since lot 1 expired)
    await waitUntil(t0 + 10000);
    res = await request(app).get(`/inventory/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 20, validTill: t0 + 15000 });

    // 8. t=t0+13000, Sell 13 items
    await waitUntil(t0 + 13000);
    await request(app)
      .post(`/inventory/${item}/sell`)
      .send({ quantity: 13 })
      .expect(200);

    // 9. t=t0+14000, Check quantity (7), validTill = t0 + 20000
    await waitUntil(t0 + 14000);
    res = await request(app).get(`/inventory/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 7, validTill: t0 + 20000 });

    // 10. t=t0+17000, Check quantity (7), validTill = t0 + 20000 (no change)
    await waitUntil(t0 + 17000);
    res = await request(app).get(`/inventory/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 7, validTill: t0 + 20000 });

    // 11. t=t0+20000, Check quantity (0), validTill = null (everything expired)
    await waitUntil(t0 + 20000);
    res = await request(app).get(`/inventory/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 0, validTill: null });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
