const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const { StatusCodes } = require("http-status-codes");

const createUser = async ({ name, email, password }) => {
  // check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }

  // create user (bcrypt middleware will hash password)
  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

module.exports = { createUser };
