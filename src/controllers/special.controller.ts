import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Car } from "../models/car.model";

export const getModelCar: RequestHandler = async (req, res, next) => {
  const { models } = req.query;

  try {
    if (!models) {
      throw createHttpError(406, "Missing models query parameter");
    }

    const modelArray = models
      .toLocaleString()
      .split(",")
      .map((model) => model.trim().toLowerCase());

    if (modelArray.length === 0) {
      throw createHttpError(406, "No valid models provided");
    }

    const cars = await Car.find({
      $or: modelArray.map((model) => ({ model })),
    }).toArray();

    if (cars.length < 1) {
      throw createHttpError(404, `No Cars Found In ${models} Model`);
    }

    return res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

export const availableCarsModel: RequestHandler = async (req, res, next) => {
  const model = req.query.model?.toLocaleString().toLowerCase();

  try {
    if (!model) {
      throw createHttpError(406, "Missing model query parameter");
    }

    const cars = await Car.find({
      $and: [{ model }, { status: "available" }],
    }).toArray();

    if (cars.length < 1) {
      throw createHttpError(404, `No Cars Available In ${model} Model`);
    }

    return res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

export const rentedCarsModel: RequestHandler = async (req, res, next) => {
  const model = req.query.model?.toLocaleString().toLowerCase();

  try {
    if (!model) {
      throw createHttpError(406, "Missing model query parameter");
    }

    const cars = await Car.find({
      $and: [{ model }, { status: "rented" }],
    }).toArray();

    if (cars.length < 1) {
      throw createHttpError(404, `No Cars Rented In ${model} Model`);
    }

    return res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

export const availableRentedCars: RequestHandler = async (req, res, next) => {
  const model = req.query.model?.toLocaleString().toLowerCase();

  try {
    if (!model) {
      throw createHttpError(406, "Missing model query parameter");
    }

    const cars = await Car.find({
      $and: [
        { model },
        { $or: [{ status: "rented" }, { status: "available" }] },
      ],
    }).toArray();

    if (cars.length < 1) {
      throw createHttpError(
        404,
        `No Cars Rented Or Available In ${model} Model`
      );
    }

    return res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};
