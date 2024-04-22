const { HttpError, ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password, username } = req.body;
  const user = await User.findOne({ email, username });
  const un = await User.findOne({ username });

  if (user) {
    throw HttpError(409, "Email already in use");
  } else if (un) throw HttpError(409, "Username already in use");

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    username: newUser.username,
    name: newUser.name,
  });
};

const login = async (req, res, next) => {
  const { email, password, username } = req.body;
  const user = (await User.findOne({ email }))
    ? await User.findOne({ email })
    : await User.findOne({ username });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  res.status(201).json({
    token,
  });
};

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

const updatebyId = async (req, res, next) => {
  const { id } = req.params;
  const result = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  const result = await User.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Deleted!" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  updatebyId: ctrlWrapper(updatebyId),
  deleteById: ctrlWrapper(deleteById),
};
