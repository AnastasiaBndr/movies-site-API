const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const statusList = ["favorite", "dropped", "watching", "finished"];
const mediaTypeList = ["movie", "TV"];

const movieSchema = new Schema(
  {
    globalId: String,
    name: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: statusList,
    },
    media_type: {
      type: String,
      required: true,
      enum: mediaTypeList,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const addSchema = Joi.object({
  globalId: Joi.string().required(),
  name: Joi.string().required(),
  poster: Joi.string().required(),
  status: Joi.string()
    .valid(...statusList)
    .required(),
  media_type: Joi.string()
    .valid(...mediaTypeList)
    .required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...statusList)
    .required(),
});

movieSchema.post("save", handleMongooseError);

const schemas = { addSchema, updateStatusSchema };

const Movie = model("movie", movieSchema);

module.exports = {
  Movie,
  schemas,
};
