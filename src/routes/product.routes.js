import express from "express";
import {
  create,
  list,
  update,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import {
  productCreateValidator,
  productListValidator,
} from "../utils/validators.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorizeRole("admin"),
  productCreateValidator,
  validateRequest,
  create
  /*
    #swagger.tags = ["Products"]
    #swagger.summary = "Create product"
    #swagger.security = [{ "BearerAuth": [] }]
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['image'] = {
      in: 'formData',
      type: 'file',
      required: false,
      description: "Product image"
    }
    #swagger.parameters['body'] = {
      in: 'formData',
      schema: {
        $name: "iPhone 16",
        $price: 999,
        $stock: 10,
        $categoryId: 1,
        description: "Latest model"
      }
    }
    #swagger.responses[201] = { description: "Created" }
  */
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole("admin"),
  update
  /*
    #swagger.tags = ["Products"]
    #swagger.summary = "Update product"
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['id'] = {
      in: "path",
      required: true,
      type: "integer"
    }
    #swagger.parameters['image'] = {
      in: 'formData',
      type: 'file'
    }
    #swagger.parameters['body'] = {
      in: 'formData',
      schema: {
        name: "iPhone Updated",
        price: 950,
        stock: 8,
        categoryId: 1,
        description: "Updated spec"
      }
    }
    #swagger.responses[200] = { description: "Updated" }
  */
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole("admin"),
  deleteProduct
  /*
    #swagger.tags = ["Products"]
    #swagger.summary = "Delete product"
    #swagger.parameters['id'] = {
      in: "path",
      required: true,
      type: "integer"
    }
    #swagger.responses[204] = { description: "Deleted" }
  */
);


router.get(
  "/",
  productListValidator,
  validateRequest,
  list
  /*
    #swagger.tags = ["Products"]
    #swagger.summary = "List products"
    #swagger.parameters['page'] = { in: 'query', type: 'integer' }
    #swagger.parameters['pageSize'] = { in: 'query', type: 'integer' }
    #swagger.parameters['minPrice'] = { in: 'query', type: 'number' }
    #swagger.parameters['maxPrice'] = { in: 'query', type: 'number' }
    #swagger.parameters['categoryId'] = { in: 'query', type: 'integer' }
    #swagger.parameters['search'] = { in: 'query', type: 'string' }
  */
);


export default router;
