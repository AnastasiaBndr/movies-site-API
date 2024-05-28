const { HttpError, ctrlWrapper } = require("../helpers");
const { Movie } = require("../models/movie");

const getAll = async (req, res) => {
  const { _id: owner } = req.query;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Movie.find({ owner }, "", {
    skip,
    limit,
  }).populate("owner", "name username");
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Movie.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const getByGlobalIdTypeAndMediaType = async (req, res) => {
  const { globalId, media_type } = req.body;
  const result = await Movie.findOne({
    globalId: globalId,
    media_type: media_type,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const getByStatus = async (req, res) => {
  const { _id: owner } = req.body;
  const { status } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Movie.find({ status: status, owner }, "", {
    skip,
    limit,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { globalId, movie_type } = req.body;
  const existingMovie = await Movie.findOne({
    globalId: globalId,
    movie_type: movie_type,
  });
  if (existingMovie) {
    const result = await Movie.findOneAndUpdate(
      { globalId: globalId, movie_type: movie_type },
      { ...req.body, owner },
      {
        new: true,
      }
    );
    res.status(201).json(result);
  } else {
    const result = await Movie.create({ ...req.body, owner });
    res.status(201).json(result);
  }
};

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const result = await Movie.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Movie.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Deleted!" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updateStatus: ctrlWrapper(updateStatus),
  getByStatus: ctrlWrapper(getByStatus),
};
