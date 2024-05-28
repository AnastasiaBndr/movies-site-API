const { HttpError, ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password, username } = req.body;
  const user = await User.findOne({ email });
  const un = await User.findOne({ username });

  if (user) {
    throw HttpError(409, "Email or username already in use");
  }
  if (un) {
    throw HttpError(409, "Email or username already in use");
  }

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
  console.log(email);
  const user = (await User.findOne({ username }))
    ? await User.findOne({ username })
    : await User.findOne({ email });

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

  res.status(201).json({ token: token });
};

const updatebyId = async (req, res, next) => {
  const { id } = req.params;
  const result = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const findByUsername = async (req, res, next) => {
  const { username } = req.params;
  const result = await User.findOne({ username: username }).select(
    "name username email token avatar createdAt"
  );
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const findByEmail = async (req, res, next) => {
  const { email } = req.params;
  const result = await User.find({ email: email }).select(
    "name username email token avatar createdAt"
  );
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const getCurrent = async (req, res) => {
  const { email, username, name, id } = req.user;
  res.json({ name, username, email, id });
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
  findByUsername: ctrlWrapper(findByUsername),
  findByEmail: ctrlWrapper(findByEmail),
};
