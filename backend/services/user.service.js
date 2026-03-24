const User = require("../models/user.model");
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

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", StatusCodes.FORBIDDEN);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return {
    token,
    data: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  };
};

module.exports = { createUser, loginUser };
