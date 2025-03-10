import request from "supertest";
import app from "../app";
import { waitUntil } from "./utils";

describe("Inventory API - Item: foo", () => {
  it("item foo - should correctly handle inventory addition, selling, and expiration", async () => {
    const item = "foo";
    const t0 = Date.now();

    // 1. t=t0, Add 10 items expiring at t0 + 10000
    await request(app)
      .post(`/${item}/add`)
      .send({ quantity: 10, expiry: t0 + 10000 })
      .expect(201);

    // 2. t=t0+5000, Check quantity
    await waitUntil(t0 + 5000);
    let res = await request(app).get(`/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 10, validTill: t0 + 10000 });

    // 3. t=t0+7000, , Add 5 more items expiring at t0 + 20000
    await waitUntil(t0 + 7000);
    await request(app)
      .post(`/${item}/add`)
      .send({ quantity: 5, expiry: t0 + 20000 })
      .expect(201);

    // 4. t=t0+8000, Check quantity
    await waitUntil(t0 + 8000);
    res = await request(app).get(`/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 15, validTill: t0 + 10000 });

    // 5. t=t0+10000, Check quantity (first lot expired)
    await waitUntil(t0 + 10000);
    res = await request(app).get(`/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 5, validTill: t0 + 20000 });

    // 6. t=t0+12000, Sell 3 items
    await waitUntil(t0 + 12000);
    await request(app)
      .post(`/${item}/sell`)
      .send({ quantity: 3 })
      .expect(200);

    // 7. t=t0+13000, Check quantity (should be 2)
    await waitUntil(t0 + 13000);
    res = await request(app).get(`/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 2, validTill: t0 + 20000 });

    // 8. t=t0+20000, Check quantity (all expired)
    await waitUntil(t0 + 20000);
    res = await request(app).get(`/${item}/quantity`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ quantity: 0, validTill: null });
  });
});
