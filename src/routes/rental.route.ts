import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createRental,
  deleteRental,
  getAllRentals,
  getCarRentalById,
  updateRental,
} from "../controllers/rental.controller";

export default (router: Router) => {
  router.get("/rental", authMiddleware, getAllRentals);

  router.post("/car/:carId/rental", authMiddleware, createRental);

  router.get("/car/:carId/rental/:rentalId", authMiddleware, getCarRentalById);

  router.put("/car/:carId/rental/:rentalId", authMiddleware, updateRental);

  router.delete("/car/:carId/rental/:rentalId", authMiddleware, deleteRental);
};
