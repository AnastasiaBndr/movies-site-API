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
  await User.findByIdAndUpdate(user._id, { token }, { new: true });

  res.status(201).json({
    message: "Login is successful!",
  });
};

const updatebyId = async (req, res, next) => {
  const { id } = req.params;
  const result = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const getCurrent = async (req, res) => {
  const { email, username, name } = req.user;
  res.json({ name, username, email });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout is successful" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  updatebyId: ctrlWrapper(updatebyId),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
