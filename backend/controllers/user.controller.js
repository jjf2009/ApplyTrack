const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service');
const AppError = require('../utils/AppError');

// Helper: throw validation errors early so service stays clean
const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors.array().map((e) => e.msg).join(', '),
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

// GET /users
const getAll = async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  res.status(StatusCodes.OK).json({ success: true, count: users.length, data: users });
};

// GET /users/:id
const getOne = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(StatusCodes.OK).json({ success: true, data: user });
};

// POST /users
const create = async (req, res) => {
  checkValidation(req);
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: user });
};

// PATCH /users/:id
const update = async (req, res) => {
  checkValidation(req);
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ success: true, data: user });
};

// DELETE /users/:id
const remove = async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = { getAll, getOne, create, update, remove };
