const express = require("express");

const ctrl = require("../../controllers/users");

const { validateBody } = require("../../middlewares");

const schemas = require("../../schemas/user");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:userId", ctrl.getById);

router.post("/", validateBody(schemas.addSchema), ctrl.add);

router.delete("/:userId", ctrl.deleteById);

router.put("/:userId", validateBody(schemas.addSchema), ctrl.updatebyId);

module.exports = router;
