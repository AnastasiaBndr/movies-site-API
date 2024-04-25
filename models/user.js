const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailValidation = /^[\w]+@([\w-])+[\w-]{2,4}$/;
const usernamePattern = /@\w/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      match: usernamePattern,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      match: emailValidation,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    avatar: {
      type: String,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().pattern(usernamePattern).required(),
  email: Joi.string().pattern(emailValidation).required(),
  password: Joi.string().min(6).required(),
  avatar: Joi.string().optional(),
});

const loginSchema = Joi.object()
  .keys({
    username: Joi.string().pattern(usernamePattern),
    email: Joi.string().pattern(emailValidation),
    password: Joi.string().min(6).required(),
    avatar: Joi.string().optional(),
  })
  .or("username", "email");

const updateUser = Joi.object({
  name: Joi.string(),
  username: Joi.string().pattern(usernamePattern),
  password: Joi.string().min(6),
  avatar: Joi.string(),
});

userSchema.post("save", handleMongooseError);

const schemas = { registerSchema, loginSchema, updateUser };

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
