const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const protect = require("../middleware/auth");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/application.controller");

// 🔹 Validation rules
const applicationValidation = [
  body("company").notEmpty().withMessage("Company is required"),
  body("role").notEmpty().withMessage("Role is required"),
];

// 🔹 CREATE
router.post("/", protect, applicationValidation, create);

// 🔹 GET ALL
router.get("/", protect, getAll);

// 🔹 GET ONE
router.get("/:id", protect, getOne);

// 🔹 UPDATE
router.patch("/:id", protect, applicationValidation, update);

// 🔹 DELETE
router.delete("/:id", protect, remove);

module.exports = router;
