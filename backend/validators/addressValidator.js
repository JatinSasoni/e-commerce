import { body } from "express-validator";

export const addressValidator = [
  body("street").notEmpty().withMessage("Street is required"),

  body("city").notEmpty().withMessage("City is required"),

  body("state").notEmpty().withMessage("State is required"),
  body("zipCode").notEmpty().withMessage("Zip Code is required"),

  body("country").notEmpty().withMessage("Country is required"),
];
