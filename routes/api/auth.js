const express = require("express");

const router = express.Router();
const { validateBody, authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const { schemas } = require("../../models/user");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.post("/auth", validateBody(schemas.loginSchema), ctrl.login);
router.get("/current", authenticate, ctrl.getCurrent);
router.post("/logout", authenticate, ctrl.logout);
router.get("/username/:username", ctrl.findByUsername);
router.get("/email/:email", authenticate, ctrl.findByEmail);

module.exports = router;
