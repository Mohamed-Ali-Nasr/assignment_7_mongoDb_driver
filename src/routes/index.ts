import express, { Router } from "express";
import user from "./user.route";
import car from "./car.route";
import rental from "./rental.route";
import special from "./special.route";

const router = express.Router();

export default (): Router => {
  user(router);
  car(router);
  rental(router);
  special(router);

  return router;
};
