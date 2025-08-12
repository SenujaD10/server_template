import { Router } from "express";
import { authController } from "../controllers/authController";

export const authRouter = Router();

authRouter.route("/register").post(authController.register)
authRouter.route("/login").post(authController.login)
authRouter.route("/user").get(authController.verify, authController.getUser)
authRouter.route("/logout").delete(authController.verify, authController.logout)