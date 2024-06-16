import { NextFunction, RequestHandler, Response } from "express";
import { IRequest } from "../middlewares/auth.middleware";
import createHttpError from "http-errors";
import { Car } from "../models/car.model";
import { ObjectId } from "mongodb";
import { Rental } from "../models/rental.modal";
import { validateDate } from "../utils/validateDate";

export const createRental = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const { rentalDate, returnDate } = req.body;

  const { carId } = req.params;

  try {
    if (!userId || !carId || !rentalDate || !returnDate) {
      throw createHttpError(406, "Missing data!");
    }
    const car = await Car.findOne({ _id: new ObjectId(carId) });

    if (!car) {
      throw createHttpError(404, "No Cars Found By This Id");
    }

    const rentalCar = await Rental.findOne({ carId });

    if (rentalCar) {
      throw createHttpError(
        404,
        "This Car Is Already Rented, Please Choose a Different One"
      );
    }

    const { startDate, endDate } = validateDate(rentalDate, returnDate);

    const newRental = await Rental.insertOne({
      rentalDate: startDate,
      returnDate: endDate,
      carId,
      userId,
    });

    await Car.updateOne(
      { _id: new ObjectId(carId) },
      { $set: { status: "rented" } }
    );

    res
      .status(201)
      .json({ message: "New Rental Car Created Successfully", newRental });
  } catch (error) {
    next(error);
  }
};

export const getAllRentals: RequestHandler = async (req, res, next) => {
  try {
    const rentals = await Rental.find().toArray();

    if (rentals.length < 1) {
      throw createHttpError(404, "No Rentals Found");
    }

    return res.status(200).json(rentals);
  } catch (error) {
    next(error);
  }
};

export const getCarRentalById: RequestHandler = async (req, res, next) => {
  const { carId, rentalId } = req.params;

  try {
    if (!carId || !rentalId) {
      throw createHttpError(406, "Missing data!");
    }

    const car = await Car.findOne({ _id: new ObjectId(carId) });

    if (!car) {
      throw createHttpError(404, "No Cars Found By This Id");
    }

    const rentalCar = await Rental.findOne({ _id: new ObjectId(rentalId) });

    if (!rentalCar) {
      throw createHttpError(404, "This Car Doesn't Rented Yet");
    }

    res.status(200).json(rentalCar);
  } catch (error) {
    next(error);
  }
};

export const updateRental = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const { rentalDate, returnDate } = req.body;

  const { carId, rentalId } = req.params;

  try {
    if (!userId || !carId || !rentalId || !rentalDate || !returnDate) {
      throw createHttpError(406, "Missing data!");
    }

    const car = await Car.findOne({ _id: new ObjectId(carId) });

    if (!car) {
      throw createHttpError(404, "No Cars Found By This Id");
    }

    const rentalCar = await Rental.findOne({
      _id: new ObjectId(rentalId),
      carId,
      userId,
    });

    if (!rentalCar) {
      throw createHttpError(404, "This Car Doesn't Rented Yet");
    }

    const { startDate, endDate } = validateDate(rentalDate, returnDate);

    const updatedRentalCar = await Rental.updateOne(
      { _id: new ObjectId(rentalId) },
      {
        $set: { rentalDate: startDate, returnDate: endDate },
      }
    );

    if (updatedRentalCar.modifiedCount === 0) {
      throw createHttpError(
        404,
        "Rental Car Doesn't Updated Yet, Please Insert a New Data"
      );
    }

    res
      .status(201)
      .json({ message: "Rental Car Updated Successfully", updatedRentalCar });
  } catch (error) {
    next(error);
  }
};

export const deleteRental = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const { carId, rentalId } = req.params;

  try {
    if (!userId || !carId || !rentalId) {
      throw createHttpError(406, "Missing data!");
    }

    const car = await Car.findOne({ _id: new ObjectId(carId) });

    if (!car) {
      throw createHttpError(404, "No Cars Found By This Id");
    }

    const rentalCar = await Rental.findOne({
      _id: new ObjectId(rentalId),
      carId,
      userId,
    });

    if (!rentalCar) {
      throw createHttpError(404, "This Car Doesn't Rented Yet");
    }

    const deletedRentalCar = await Rental.deleteOne({
      _id: new ObjectId(rentalId),
    });

    await Car.updateOne(
      { _id: new ObjectId(carId) },
      { $set: { status: "available" } }
    );

    res
      .status(201)
      .json({ message: "Rental Car Deleted Successfully", deletedRentalCar });
  } catch (error) {
    next(error);
  }
};
