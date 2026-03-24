const express = require("express");
const router = express.Router();

const { register,login } = require("../controllers/user.controller");

// POST /api/v1/auth/register
router.post("/register", register);
// POST /api/v1/auth/login
router.post("/login",login);

module.exports = router; // ✅ export the router, not the function
