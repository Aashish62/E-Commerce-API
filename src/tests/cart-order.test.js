
import request from 'supertest';
import app from '../app.js';
import { sequelize } from '../models/index.js';

let customerToken, adminToken, productId;
beforeAll(async () => {
  await sequelize.sync({ force: true });

  // create admin
  await request(app).post('/api/auth/signup').send({ email: 'admin@example.com', password: 'password', role: 'admin' });
  const adminLogin = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'password' });
  adminToken = adminLogin.body.token;

  // create a category & product
  let imageBase64 = "";
  const cat = await request(app).post('/api/categories').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Books' });
  const product = await request(app).post('/api/products').set('Authorization', `Bearer ${adminToken}`).send({
    name: "Phone",
    price: 499,
    stock: 10,
    categoryId: cat.body.data.id,
    image: imageBase64,
  });
  productId = product.body.data.id;

  // create customer
  await request(app).post('/api/auth/signup').send({ email: 'cust@example.com', password: 'password', role: 'customer' });
  const custLogin = await request(app).post('/api/auth/login').send({ email: 'cust@example.com', password: 'password' });
  customerToken = custLogin.body.token;
});

afterAll(async () => await sequelize.close());

test('add to cart, price persistence and place order', async () => {
  // add to cart
  const add = await request(app).post('/api/cart').set('Authorization', `Bearer ${customerToken}`).send({ productId, quantity: 2 });
  expect(add.statusCode).toBe(201);

  // change product price by admin (simulate price change)
  await request(app).put(`/api/products/${productId}`).set('Authorization', `Bearer ${adminToken}`).send({ price: 30 });

  // get cart — priceAtAddition should remain as original (20)
  const cart = await request(app).get('/api/cart').set('Authorization', `Bearer ${customerToken}`);
  expect(cart.statusCode).toBe(200);
  expect(cart.body.items[0].priceAtAddition).toBe(499);

  // place order, total should be 40
  const orderRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${customerToken}`).send();
  expect(orderRes.statusCode).toBe(201);

  // order history
  const orders = await request(app).get('/api/orders').set('Authorization', `Bearer ${customerToken}`);
  expect(orders.statusCode).toBe(200);
  expect(orders.body.length).toBeGreaterThan(0);
});
