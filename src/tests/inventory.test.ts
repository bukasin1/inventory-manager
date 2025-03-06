import request from "supertest";
import app from "../app";

describe("Inventory API", () => {
  describe("General tests", () => {
    const t0 = Date.now();
    it("should add an item", async () => {
      const res = await request(app)
        .post("/inventory/apple/add")
        .send({ quantity: 10, expiry: t0 + 10000 });
      expect(res.status).toBe(201);
    });

    it("should get item quantity", async () => {
      const res = await request(app).get("/inventory/apple/quantity");
      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(10);
      expect(res.body.validTill).toBe(t0 + 10000);
    });

    it("should sell an item", async () => {
      const res = await request(app)
        .post("/inventory/apple/sell")
        .send({ quantity: 5 });
      expect(res.status).toBe(200);
    });

    it("should get item quantity", async () => {
      const res = await request(app).get("/inventory/apple/quantity");
      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(5);
      expect(res.body.validTill).toBe(t0 + 10000);
    });

    it("should sell an item", async () => {
      const res = await request(app)
        .post("/inventory/apple/sell")
        .send({ quantity: 5 });
      expect(res.status).toBe(200);
    });

    it("should get item quantity", async () => {
      const res = await request(app).get("/inventory/apple/quantity");
      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(0);
      expect(res.body.validTill).toBe(null);
    });
  });
});
