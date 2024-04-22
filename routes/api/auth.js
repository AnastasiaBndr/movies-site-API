const express = require("express");

const router = express.Router();
const { validateBody } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const { schemas } = require("../../models/user");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.post("/auth", validateBody(schemas.loginSchema), ctrl.login);

module.exports = router;
