import { error, checkValidation, failed } from "./helper.js";
import expressAsyncHandler from "express-async-handler";
import { Validator } from "node-input-validator";
import jwt from "jsonwebtoken";
import User from "../Model/User.js";

export const checkPublishAndSecretKey = async (req, res, next) => {
  const v = new Validator(req.headers, {
    secret_key: "required|string",
    publish_key: "required|string",
  });
  const errorResponse = await checkValidation(v);
  if (errorResponse) {
    return failed(res, errorResponse);
  }
  const { secret_key, publish_key } = req.headers;
  if (
    secret_key !== process.env.SECRET_KEY ||
    publish_key !== process.env.PUBLISH_KEY
  ) {
    return failed(res, "Key not Matched!");
  }
  next();
};

export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      let result = await jwt.verify(token, process.env.JWT_SECRET_KEY);

      let checkUser = await User.findOne({
        _id: result.id,
        login_time: result.iat,
      });
      if (checkUser) {
        req.user = checkUser;
        next();
      } else {
        return error(res, "Please Login first");
      }
    } catch (err) {
      error(res, err.message);
    }
  } else {
    return error(res, "No Authorized, No Token");
  }
});
