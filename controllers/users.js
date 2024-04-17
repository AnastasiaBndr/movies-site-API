const { HttpError } = require("../helpers");
const users = require("../models/users");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await users.listUsers();
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await users.getUserById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res, next) => {
  const result = await users.addUser(req.body);
  res.status(201).json(result);
};

const updatebyId = async (req, res, next) => {
  const { id } = req.params;
  const result = await users.updateUser(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  const result = await users.removeUser(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Deleted!" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updatebyId: ctrlWrapper(updatebyId),
  deleteById: ctrlWrapper(deleteById),
};
