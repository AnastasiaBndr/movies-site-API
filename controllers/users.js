const { HttpError } = require("../helpers");
const User = require("../models/user");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await User.find();
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await User.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res, next) => {
  const result = await User.create(req.body);
  res.status(201).json(result);
};

const updatebyId = async (req, res, next) => {
  const { id } = req.params;
  const result = await User.updateOne(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  const result = await User.deleteOne(id);
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
