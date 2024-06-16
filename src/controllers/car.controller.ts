import { NextFunction, RequestHandler, Response } from "express";
import { IRequest } from "../middlewares/auth.middleware";
import createHttpError from "http-errors";
import { Car } from "../models/car.model";
import { ObjectId } from "mongodb";

export const addCar = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const { name, model, status } = req.body;

  try {
    if (!userId || !name || !model || !status) {
      throw createHttpError(406, "Missing data!");
    }

    const existingName = await Car.findOne({ name });
    if (existingName) {
      throw createHttpError(
        400,
        "This Car Name Is Already Exist. Please Choose a Different One"
      );
    }

    const newCar = await Car.insertOne({
      name,
      model,
      status,
      userId,
    });

    res.status(201).json({ message: "Car Created Successfully", newCar });
  } catch (error) {
    next(error);
  }
};

export const getAllCars: RequestHandler = async (req, res, next) => {
  try {
    const cars = await Car.find().toArray();

    if (cars.length < 1) {
      throw createHttpError(400, "There Is No Cars yet");
    }

    res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

export const getCarById: RequestHandler = async (req, res, next) => {
  const { carId } = req.params;

  try {
    if (!carId) {
      throw createHttpError(406, "Missing data!");
    }

    const car = await Car.findOne({ _id: new ObjectId(carId) });

    if (!car) {
      throw createHttpError(400, "There Is No Car With This Id");
    }

    res.status(200).json(car);
  } catch (error) {
    next(error);
  }
};

export const updateCar = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { name, model, status } = req.body;
  const { carId } = req.params;

  try {
    if (!userId || !name || !model || !status || !carId) {
      throw createHttpError(406, "Missing data!");
    }

    const car = await Car.findOne({ _id: new ObjectId(carId), userId });

    if (!car) {
      throw createHttpError(404, "No Cars Found By This User");
    }

    const updatedCar = await Car.updateOne(
      { _id: new ObjectId(carId) },
      {
        $set: { name, model, status },
      }
    );

    if (updatedCar.modifiedCount === 0) {
      throw createHttpError(
        404,
        "Car Doesn't Updated Yet, Please Insert a New Data"
      );
    }

    res.status(201).json({ message: "Car Updated Successfully", updatedCar });
  } catch (error) {
    next(error);
  }
};

export const deleteCar = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { carId } = req.params;

  try {
    if (!userId || !carId) {
      throw createHttpError(406, "Missing data!");
    }

    const car = await Car.findOne({ _id: new ObjectId(carId), userId });

    if (!car) {
      throw createHttpError(404, "No Cars Found By This User");
    }

    const deletedCar = await Car.deleteOne({ _id: new ObjectId(carId) });

    res.status(201).json({ message: "Car Deleted Successfully", deletedCar });
  } catch (error) {
    next(error);
  }
};
