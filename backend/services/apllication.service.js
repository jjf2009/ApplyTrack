const Application = require("../models/application.model");
const AppError = require("../utils/AppError");
const { StatusCodes } = require("http-status-codes");

// 🔹 CREATE
const create = async ({
  user,
  company,
  role,
  status,
  appliedDate,
  notes,
  link,
}) => {
  // Normalize input
  const normalizedCompany = company.trim().toLowerCase();
  const normalizedRole = role.trim().toLowerCase();

  // Check duplicate
  const existingApplication = await Application.findOne({
    user,
    company: normalizedCompany,
    role: normalizedRole,
  });

  if (existingApplication) {
    throw new AppError(
      "Application already exists for this company and role",
      StatusCodes.CONFLICT,
    );
  }

  const app = await Application.create({
    user,
    company: normalizedCompany,
    role: normalizedRole,
    status,
    appliedDate,
    notes,
    link,
  });

  return app;
};

// 🔹 GET ALL (with optional filters)
// 🔹 GET ALL (with pagination + search + filters)
const getAll = async (userId, query) => {
  // 🔹 Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // 🔹 Base filter (ownership)
  const filter = { user: userId };

  // 🔹 Optional filtering
  if (query.status) {
    filter.status = query.status;
  }

  if (query.company) {
    filter.company = query.company.toLowerCase();
  }

  // 🔹 Search (company name - flexible)
  if (query.search) {
    filter.company = {
      $regex: query.search,
      $options: "i", // case-insensitive
    };
  }

  // 🔹 Query execution
  const apps = await Application.find(filter)
    .sort({ createdAt: -1 }) // latest first
    .skip(skip)
    .limit(limit);

  // 🔹 Total count (for pagination)
  const total = await Application.countDocuments(filter);

  return {
    data: apps,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};
// 🔹 GET ONE
const getOne = async (id, userId) => {
  const app = await Application.findById(id);

  if (!app) {
    throw new AppError("Application not found", StatusCodes.NOT_FOUND);
  }

  // Ownership check
  if (app.user.toString() !== userId) {
    throw new AppError("Not authorized", StatusCodes.FORBIDDEN);
  }

  return app;
};

// 🔹 UPDATE
const update = async (id, data, userId) => {
  const app = await Application.findById(id);

  if (!app) {
    throw new AppError("Application not found", StatusCodes.NOT_FOUND);
  }

  // Ownership check
  if (app.user.toString() !== userId) {
    throw new AppError("Not authorized", StatusCodes.FORBIDDEN);
  }

  // Normalize if updating
  if (data.company) {
    data.company = data.company.trim().toLowerCase();
  }

  if (data.role) {
    data.role = data.role.trim().toLowerCase();
  }

  const updatedApp = await Application.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updatedApp;
};

// 🔹 DELETE
const remove = async (id, userId) => {
  const app = await Application.findById(id);

  if (!app) {
    throw new AppError("Application not found", StatusCodes.NOT_FOUND);
  }

  // Ownership check
  if (app.user.toString() !== userId) {
    throw new AppError("Not authorized", StatusCodes.FORBIDDEN);
  }

  await app.deleteOne();

  return;
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};
