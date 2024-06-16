import jwt from "jsonwebtoken";
import env from "./validateEnv";
import { AuthToken } from "../models/authToken.model";
import { WithId } from "mongodb";

export const generateTokens = async (
  user: WithId<Document>
): Promise<{ accessToken?: string; err?: Error }> => {
  console.log(user);

  try {
    const accessToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userToken = await AuthToken.findOne({ userId: user._id });

    if (userToken) await AuthToken.deleteOne({ userId: user._id });

    await AuthToken.insertOne({
      userId: user._id,
      token: accessToken,
    });

    return { accessToken };
  } catch (err: any) {
    return err;
  }
};
