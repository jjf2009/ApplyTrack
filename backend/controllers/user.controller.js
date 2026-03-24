const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const userService = require("../services/user.service");
const AppError = require("../utils/AppError");

// helper
const checkValidation = (req) => {    /// need better understanding of it 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors
        .array()
        .map((e) => e.msg)
        .join(", "),
      StatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
};

const  register  = async (req, res, next) => {
  try {
    checkValidation(req);

    const user = await userService.createUser(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err); // important → global error handler
  }
};
const login = async (req, res, next) => {
  try {
    checkValidation(req);

    const { email, password } = req.body;

    const result = await userService.loginUser({ email, password });

    res.status(StatusCodes.OK).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { register,login };
