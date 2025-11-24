import express from "express";
import {
  create,
  list,
  update,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { categoryValidator } from "../utils/validators.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRole("admin"));
router.post(
  "/",
  categoryValidator,
  validateRequest,
  create
  /*
    #swagger.tags = ["Categories"]
    #swagger.summary = "Create category"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $name: "Electronics",
        description: "Devices & gadgets"
      }
    }
    #swagger.responses[201] = { description: "Category created" }
  */
);

router.get(
  "/",
  list
  /*
    #swagger.tags = ["Categories"]
    #swagger.summary = "List all categories"
    #swagger.responses[200] = { description: "Fetched categories" }
  */
);

router.put(
  "/:id",
  categoryValidator,
  validateRequest,
  update
  /*
    #swagger.tags = ["Categories"]
    #swagger.summary = "Update category"
    #swagger.parameters['id'] = {
      in: "path",
      required: true,
      type: "integer",
      description: "Category ID"
    }
    #swagger.parameters['body'] = {
      in: 'body',
      schema: {
        name: "Mobiles",
        description: "Phone devices"
      }
    }
    #swagger.responses[200] = { description: "Updated" }
  */
);

router.delete(
  "/:id",
  deleteCategory
  /*
    #swagger.tags = ["Categories"]
    #swagger.summary = "Delete category"
    #swagger.parameters['id'] = {
      in: "path",
      required: true,
      type: "integer",
      description: "Category ID"
    }
    #swagger.responses[204] = { description: "Deleted" }
  */
);


export default router;
