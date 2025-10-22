import { Router } from "express";
import { login, logoutUser, resgisterUser } from "../controllers/auth.controller.js"; 
import { validate } from "../middlewares/validator.middleware.js";
import { userLoginValidator, userRegisterValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
 const router = Router();
 router.route("/register").post(userRegisterValidator(),validate, resgisterUser);
 router.route("/login").post( userLoginValidator(),validate,login );
 try {
    router.route("/logout").post( verifyJWT,logoutUser );
    
 } catch (error) {
    console.log("reee");
    
 }
 
 export default router;