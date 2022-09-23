import express from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  forgot_Password,
  Verify_otp,
  updateForgetPassword,
} from "../controller/authController.js";
import {
  authMiddleware,
  checkPublishAndSecretKey,
} from "../middleware/checkKeys.js";

const userRoute = express.Router();
//Api for Create a new User
userRoute.post(
  "/createUser",
  checkPublishAndSecretKey,
  authMiddleware,
  registerUser
);
//Get All users
userRoute
  .route("/getUsers")
  .get(checkPublishAndSecretKey, authMiddleware, getUsers);
userRoute.route("/login").post(checkPublishAndSecretKey, loginUser);
//Update User info eg. firstName,lastName,email etc.---------
userRoute
  .route("/updateUser/:userId")
  .put(checkPublishAndSecretKey, authMiddleware, updateUser);

//Logut Api----------
userRoute
  .route("/logout")
  .get(checkPublishAndSecretKey, authMiddleware, logoutUser);

//Forgot Password Api starts here--------------
userRoute
  .route("/forgot_Password")
  .post(checkPublishAndSecretKey, forgot_Password);
userRoute.route("/verify_otp").post(checkPublishAndSecretKey, Verify_otp);
userRoute
  .route("/updateForgetPassword/:email")
  .post(checkPublishAndSecretKey, updateForgetPassword);

export default userRoute;
