import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { signupValidator, loginValidator } from "../utils/validators.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();


router.post(
  "/signup",
  signupValidator,
  validateRequest,
  signup
  /*
    #swagger.tags = ["Auth"]
    #swagger.summary = "User Signup"
    #swagger.description = "Register a new user account."
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $name: "John Doe",
        $email: "john@example.com",
        $password: "strongpass",
        role: "admin or customer"
      }
    }
    #swagger.responses[201] = {
      description: "Signup successful"
    }
  */
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  login
  /*
    #swagger.tags = ["Auth"]
    #swagger.summary = "User Login"
    #swagger.description = "Log in and receive a JWT token."
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $email: "john@example.com",
        $password: "strongpass"
      }
    }
    #swagger.responses[200] = {
      description: "Login successful"
    }
  */
);


export default router;
