const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const appService = require("../services/application.service");
const AppError = require("../utils/AppError");

// 🔹 Validation helper
const checkValidation = (req) => {
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

// 🔹 CREATE application
const create = async (req, res, next) => {
  try {
    checkValidation(req);

    const app = await appService.create({
      ...req.body,
      user: req.user.userId, // from JWT
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: app,
    });
  } catch (err) {
    next(err);
  }
};

// 🔹 GET one application
const getOne = async (req, res, next) => {
  try {
    const app = await appService.getOne(req.params.id, req.user.userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: app,
    });
  } catch (err) {
    next(err);
  }
};

// 🔹 GET all applications (with pagination + search)
const getAll = async (req, res, next) => {
  try {
    const result = await appService.getAll(
      req.user.userId,
      req.query
    );

    res.status(StatusCodes.OK).json({
      success: true,
      ...result, // spreads data + pagination
    });
  } catch (err) {
    next(err);
  }
};

// 🔹 UPDATE application
const update = async (req, res, next) => {
  try {
    checkValidation(req);

    const app = await appService.update(
      req.params.id,
      req.body,
      req.user.userId,
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: app,
    });
  } catch (err) {
    next(err);
  }
};

// 🔹 DELETE application
const remove = async (req, res, next) => {
  try {
    await appService.remove(req.params.id, req.user.userId);

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  getOne,
  getAll,
  update,
  remove,
};
