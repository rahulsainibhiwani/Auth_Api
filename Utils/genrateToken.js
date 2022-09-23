import jwt from "jsonwebtoken";
import { unixTimestamp } from "../middleware/helper.js";
import dotenv from "dotenv";
dotenv.config();

export const genrateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1m",
  });
  const time = unixTimestamp();
  return { token, time };
};
export const genrateTokenForOtp = (otp) => {
  const token = jwt.sign({ Otp: otp }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5m",
  });
  return token;
};
export const verifyTokenForOtp = (tok) => {
  const token = jwt.verify(tok, process.env.JWT_SECRET_KEY);
  return { token };
};
