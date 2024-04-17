const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required(),
});

module.exports = { addSchema };
