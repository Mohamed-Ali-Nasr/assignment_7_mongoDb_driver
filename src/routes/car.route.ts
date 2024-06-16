import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  addCar,
  deleteCar,
  getAllCars,
  getCarById,
  updateCar,
} from "../controllers/car.controller";

export default (router: Router) => {
  router.post("/car", authMiddleware, addCar);

  router.get("/car", authMiddleware, getAllCars);

  router.get("/car/:carId", authMiddleware, getCarById);

  router.put("/car/:carId", authMiddleware, updateCar);

  router.delete("/car/:carId", authMiddleware, deleteCar);
};
