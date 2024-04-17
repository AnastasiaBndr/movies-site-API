const express = require("express");

const ctrl = require("../../controllers/users");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:userId", ctrl.getById);

router.post("/", ctrl.add);

router.delete("/:userId", ctrl.deleteById);

router.put("/:userId", ctrl.updatebyId);

module.exports = router;
