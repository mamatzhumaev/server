import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation } from "./validations.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { UserController } from "./controllers/index.js";
const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:admin04@cluster0.egiwh0f.mongodb.net/auth?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch(() => console.log("DB error", err));
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

const PORT = 9999;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
