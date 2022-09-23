import expressAsyncHandler from "express-async-handler";
import User from "../Model/User.js";
import nodemailer from "nodemailer";

import {
  genrateTokenForOtp,
  verifyTokenForOtp,
} from "../Utils/genrateToken.js";
import { Validator } from "node-input-validator";
import {
  checkValidation,
  failed,
  success,
  error,
} from "../middleware/helper.js";
import { decryptPassword, encryptPassword } from "../Utils/cryptoEncrypt.js";
import { genrateToken } from "../Utils/genrateToken.js";

export const registerUser = expressAsyncHandler(async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (!userExist) {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: encryptPassword(req.body.password),
    };
    if (user) {
      const createdUser = await User.create(user);
      res.status(201).send(createdUser);
    } else {
      res.status(400);
      throw new Error("Something went Wrong");
    }
  } else {
    throw new Error("User Already Exist");
  }
});

export const loginUser = expressAsyncHandler(async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (!userExist) {
    return failed(res, "User not found");
  } else {
    const token = genrateToken(userExist._id);
    const password = decryptPassword(userExist.password);
    const info = {
      firstName: userExist.firstName,
      lastName: userExist.lastName,
      email: userExist.email,
    };

    if (password === req.body.password) {
      await User.updateOne(
        { _id: userExist._id },
        {
          $set: {
            login_time: token.time,
          },
        }
      );
      return success(res, "Login Success", {
        ...info,
        token: token.token,
        Time: token.time,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Email or Password");
    }
  }
});

export const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(400);
    throw new Error("Users not Found");
  }
});

export const logoutUser = expressAsyncHandler(async (req, res) => {
  const user = await User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        login_time: 0,
      },
    }
  );
  if (user) {
    return success(res, "Logout Successfully");
  } else {
    res.status(400);
    throw new Error("User not Found");
  }
});

export const updateUser = expressAsyncHandler(async (req, res) => {
  const ID = req.params.userId;
  const user = await User.findById(ID);
  if (!user) {
    return failed(res, "User not Found");
  } else {
    try {
      const v = new Validator(req.body, {
        firstName: "string",
        lastName: "string",
        email: "string|email",
      });
      const values = JSON.parse(JSON.stringify(v));
      const errorResponse = await checkValidation(v);
      if (errorResponse) {
        return failed(res, errorResponse);
      }

      user.firstName = values.inputs.firstName || user.firstName;
      user.lastName = values.inputs.lastName || user.lastName;
      user.email = values.inputs.email || user.email;
      const result = await user.save();
      return success(res, "Updated Successfully", {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      });
    } catch (err) {
      res.status(400).json(res, err.message);
    }
  }
});

export const forgot_Password = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      email: "required",
    });
    const value = JSON.parse(JSON.stringify(v));
    const errorResponse = await checkValidation(v);
    if (errorResponse) {
      return failed(res, errorResponse);
    }
    const data = await User.findOne({ email: value.inputs.email }).select(
      "email"
    );
    console.log(data);
    if (!data) {
      return failed(res, "User not found");
    }
    const otp = Math.floor(100000 + Math.random() * 1000000);
    const token = genrateTokenForOtp(otp);
    var transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "27810bee8dcf51",
        pass: "bdc637d1c947da",
      },
    });

    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: value.inputs.email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>Hello world? this is your otp : 
      ${otp}
       </b>`, // html body
    });
    return success(res, "Otp sent Successfully", token);
  } catch (err) {
    error(res, err.message);
  }
};

export const Verify_otp = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      otp: "integer|required",
    });
    const value = JSON.parse(JSON.stringify(v));
    const errorResponse = await checkValidation(v);
    if (errorResponse) {
      return failed(res, errorResponse);
    }
    const token = req.headers.authorization.split(" ")[1];
    const {
      token: { Otp },
    } = verifyTokenForOtp(token);
    if (value.inputs.otp != Otp) {
      return failed(res, "Wrong Otp");
    } else {
      return success(res, "Otp Verified");
    }
  } catch (err) {
    error(
      res,
      err.message === "token expired"
        ? "Otp expired Please Resend again"
        : err.message
    );
  }
};

export const updateForgetPassword = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      newPassword: "required|string",
      confirmNewPassword: "required|string|same:newPassword",
    });
    const value = JSON.parse(JSON.stringify(v));
    const errorResponse = await checkValidation(v);
    if (errorResponse) {
      return failed(res, errorResponse);
    }
    const pass = encryptPassword(value.inputs.confirmNewPassword);
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      user.password = pass;
      await user.save();
      return success(res, "password updated successfully");
    } else {
      return failed(res, "Please provide valid Email Id");
    }
  } catch (err) {
    return error(res, err.message);
  }
};
