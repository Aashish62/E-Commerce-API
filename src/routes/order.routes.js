import express from "express";
import { placeOrder, getOrders } from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/",
  placeOrder
  /*
    #swagger.tags = ["Orders"]
    #swagger.summary = "Place order from cart"
    #swagger.responses[201] = { description: "Order placed" }
  */
);

router.get(
  "/",
  getOrders
  /*
    #swagger.tags = ["Orders"]
    #swagger.summary = "Get user/admin orders"
    #swagger.responses[200] = { description: "Fetched orders" }
  */
);


export default router;
