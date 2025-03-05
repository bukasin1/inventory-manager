import request from "supertest";
import app from "../app";

describe("Inventory API", () => {
  it("should add an item", async () => {
    const res = await request(app)
      .post("/inventory/apple/add")
      .send({ quantity: 10, expiry: Date.now() + 10000 });
    expect(res.status).toBe(201);
  });

  it("should get item quantity", async () => {
    const res = await request(app).get("/inventory/apple/quantity");
    expect(res.status).toBe(200);
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
  });
});
