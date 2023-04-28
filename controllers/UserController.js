import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js"


export const register=async (req, res) => {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const doc = new UserModel({
        fullName: req.body.fullName,
        email: req.body.email,
        passwordHash: hash,
      });
      const user = await doc.save();
      const { passwordHash, ...userDate } = user._doc;
      res.json({
        ...userDate,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось зарегистрироваться",
      });
    }
  }


export const login= async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          message: "Пользователь не найден ",
        });
      }
      const isValidPass = await bcrypt.compare(
        req.body.password,
        user._doc.passwordHash
      );
      if (!isValidPass) {
        return res.status(403).json({
          message: "Неверный логин или пароль",
        });
      }
      const token = jwt.sign({ _id: user._id }, "secret123", {
        expiresIn: "30d",
      });
      const { passwordHash, ...userDate } = user._doc;
      res.json({
        ...userDate,
        token,
      });
    } catch (err) {
      res.status(500).json({
        message: "Не удалось авторизоваться",
      });
    }
  }


export const getMe= async (req, res) => {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: "Пользователь не найден",
        });
      }
      const { passwordHash, ...userDate } = user._doc;
      res.json(userDate);
    } catch (err) {
      res.status(500).json({
        message: "Нет доступа",
      });
    }
  }