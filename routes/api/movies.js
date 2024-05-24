const express = require("express");
const ctrl = require("../../controllers/movies");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/movie");
const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:id", authenticate, ctrl.getById);

router.get("/status/:status", authenticate, ctrl.getByStatus);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

router.delete("/:userId", authenticate, isValidId, ctrl.deleteById);

router.patch(
  "/:id/status",
  authenticate,
  validateBody(schemas.updateStatusSchema),
  ctrl.updateStatus
);

module.exports = router;
