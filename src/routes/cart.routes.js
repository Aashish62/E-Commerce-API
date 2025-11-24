import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { addToCartValidator } from "../utils/validators.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/",
  addToCartValidator,
  validateRequest,
  addToCart
  /*
    #swagger.tags = ["Cart"]
    #swagger.summary = "Add item to cart"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $productId: 1,
        $quantity: 2
      }
    }
    #swagger.responses[201] = { description: "Added to cart" }
  */
);

router.get(
  "/",
  getCart
  /*
    #swagger.tags = ["Cart"]
    #swagger.summary = "Get user cart"
    #swagger.responses[200] = { description: "Cart fetched" }
  */
);

router.delete(
  "/:id",
  removeFromCart
  /*
    #swagger.tags = ["Cart"]
    #swagger.summary = "Remove cart item"
    #swagger.parameters['id'] = {
      in: "path",
      required: true,
      type: "integer"
    }
    #swagger.responses[204] = { description: "Removed" }
  */
);


export default router;
