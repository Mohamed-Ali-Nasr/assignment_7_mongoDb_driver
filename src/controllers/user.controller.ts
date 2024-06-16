import { CookieOptions, NextFunction, RequestHandler, Response } from "express";
import { User } from "../models/user.model";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/generateTokens";
import { ObjectId, WithId } from "mongodb";
import { IRequest } from "../middlewares/auth.middleware";
import { AuthToken } from "../models/authToken.model";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
}

export const signup: RequestHandler<
  unknown,
  unknown,
  RegisterBody,
  unknown
> = async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    if (!name || !email || !password || !phoneNumber) {
      throw createHttpError(406, "Missing data!");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw createHttpError(
        400,
        "User Already Exists. Please Choose a Different One Or Log In Instead."
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.insertOne({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    res.status(201).json({ message: "User Created Successfully", newUser });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email: string;
  password: string;
}

export const signin: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw createHttpError(406, "Missing data!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(400, "Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createHttpError(400, "Invalid email or password.");
    }

    const { accessToken } = await generateTokens(user as WithId<Document>);

    res.cookie("jwt", accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    } as CookieOptions);

    res.status(201).json({ accessToken, user });
  } catch (error) {
    next(error);
  }
};

export const signOut: RequestHandler = async (req, res, next) => {
  const cookies = req.cookies;

  try {
    if (!cookies?.jwt)
      return res.status(404).json({
        message: "There Is No Token in Cookies Yet, Please Go To Login First",
      });

    res.clearCookie("jwt", {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    } as CookieOptions);

    res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find().toArray();

    if (users.length < 1) {
      throw createHttpError(400, "There Is No Users yet");
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw createHttpError(406, "Missing data!");
    }

    const user = await User.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw createHttpError(400, "There Is No User With This Id");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { name, email, password, phoneNumber } = req.body;

  try {
    if (!name || !email || !password || !phoneNumber || !userId) {
      throw createHttpError(406, "Missing data!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: { name, email, password: hashedPassword, phoneNumber },
      }
    );

    if (updatedUser.modifiedCount === 0) {
      throw createHttpError(
        404,
        "User Doesn't Updated Yet, Please Insert a New Data"
      );
    }

    res.status(201).json({ message: "User Updated Successfully", updatedUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  try {
    if (!userId) {
      throw createHttpError(406, "Missing data!");
    }

    const deletedUser = await User.deleteOne({ _id: new ObjectId(userId) });

    await AuthToken.deleteOne({ userId: new ObjectId(userId) });

    res.clearCookie("jwt", {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    } as CookieOptions);

    res.status(201).json({ message: "User Deleted Successfully", deletedUser });
  } catch (error) {
    next(error);
  }
};
