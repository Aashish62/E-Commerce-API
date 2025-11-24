import request from "supertest";
import app from "../app.js";
import { sequelize, User } from "../models/index.js";

let adminToken;
beforeAll(async () => {
  await sequelize.sync({ force: true });
  await request(app)
    .post("/api/auth/signup")
    .send({ email: "admin@example.com", password: "password", role: "admin" });
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "password" });
  adminToken = login.body.token;
}, 60000);

afterAll(async () => await sequelize.close());

test("create list product", async () => {
  const catRes = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Clothing" });
  console.log(catRes.body);
  expect(catRes.statusCode).toBe(201);

  let imageBase64 = "";
const prodRes = await request(app)
  .post("/api/products")
  .set("Authorization", `Bearer ${adminToken}`)
  .send({
    name: "Phone",
    price: 499,
    stock: 10,
    categoryId: catRes.body.data.id,
    image: imageBase64,
  });

expect(prodRes.statusCode).toBe(201);

  const list = await request(app).get("/api/products");
  expect(list.statusCode).toBe(200);
  expect(list.body.data.length).toBeGreaterThan(0);
});
