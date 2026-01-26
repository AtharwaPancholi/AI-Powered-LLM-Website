import express from "express"
import { googleAuth, login, logOut, resetPassword, sendOtp, signUp, verifyOTP } from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.get("/logout", logOut)
authRouter.post("/sendotp", sendOtp)
authRouter.post("/verifyotp", verifyOTP)
authRouter.post("/resetpassword", resetPassword)
authRouter.post("/googleauth", googleAuth)

export default authRouter