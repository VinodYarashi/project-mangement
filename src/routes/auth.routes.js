import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, login, logoutUser, refreshAccessToken, resendEmailVerification, resetForgetPassword, resgisterUser, verifyEmail } from "../controllers/auth.controller.js"; 
import { validate } from "../middlewares/validator.middleware.js";
import { userChangeCurrentPasswordValidator, userForgetPasswordValididator, userLoginValidator, userRegisterValidator, userResetForgetPasswordValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
 const router = Router();
 //unsecure routs
 router.route("/register").post(userRegisterValidator(),validate, resgisterUser);
 router.route("/login").post( userLoginValidator(),validate,login );
 router.route("/verify-email/: verificationToken").get( verifyEmail );
 router.route("/refresh-token").post( refreshAccessToken );
 router.route("/forget-password").post(userForgetPasswordValididator(),validate, forgetPasswordRequest );
 router.route("/reset-password/:resetToken").post(userResetForgetPasswordValidator(),validate, resetForgetPassword );
 //secure routs
router.route("/logout").post( verifyJWT,logoutUser );
router.route("/current-user").post( verifyJWT,getCurrentUser );
router.route("/change-password").post( verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword);
router.route("/resend-email-verifiaction").post( verifyJWT,resendEmailVerification);
    
 
 
 export default router;