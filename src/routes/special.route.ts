import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  availableCarsModel,
  availableRentedCars,
  getModelCar,
  rentedCarsModel,
} from "../controllers/special.controller";

export default (router: Router) => {
  router.get("/model-cars", authMiddleware, getModelCar);

  router.get("/available-cars", authMiddleware, availableCarsModel);

  router.get("/rented-cars", authMiddleware, rentedCarsModel);

  router.get("/available-rented-cars", authMiddleware, availableRentedCars);
};
