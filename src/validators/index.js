import {body} from "express-validator";



const userRegisterValidator =() => {
    return [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is reqired")
        .isEmail()
        .withMessage("email is invalid"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("username is reqired")
        .isLowercase()
        .withMessage("Username must be lowercase")
        .isLength({min: 3})
        .withMessage("Username must be atleast 3 charecters long"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required"),
    body("fullname")
        .optional()
        .trim(),



      
    ];
};
const userLoginValidator = () => {
    return [
        body("email")
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),
        body("password")
         .notEmpty()
         .withMessage("password is required"),
    ];
};
const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("oldPassword is required"),
        body("oldPassword").notEmpty().withMessage("new Password is required"),

    ];

};
const userForgetPasswordValididator = () => {
    return [
        body("email")
            .isEmpty()
            .withMessage("Email id required")
            .isEmail()
            .withMessage("Email is invalid")
    ]
};
const userResetForgetPasswordValidator = () => {
    return  [
        body("newPassword")
            .notEmpty()
            .withMessage("Password is required")
    ];
}
export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgetPasswordValididator,
    userResetForgetPasswordValidator
}