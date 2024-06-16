import { Router } from "express";
import {
  signup,
  signin,
  signOut,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default (router: Router) => {
  router.post("/user/sign-up", signup);

  router.post("/user/sign-in", signin);

  router.post("/user/sign-out", signOut);

  router.get("/user", getAllUsers);

  router.get("/user/:userId", getUserById);

  router.put("/user", authMiddleware, updateUser);

  router.delete("/user", authMiddleware, deleteUser);
};
