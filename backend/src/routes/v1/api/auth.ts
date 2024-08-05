import express, { Router } from "express";
import authController from "../../../controllers/auth";
import asyncMiddleware from "../../../middleware/async";

const router: Router = express.Router();

router.post("/signup", asyncMiddleware(authController.signup));
router.post("/login", asyncMiddleware(authController.login));
router.post("/refresh-token", asyncMiddleware(authController.refreshToken));

export default router;
