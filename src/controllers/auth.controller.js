import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/api-response.js";
import {ApiError} from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handeler.js";
import { emailVerificationmailgenContent, sendmail } from "../utils/mail.js";
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken};

    } catch(error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token ",
        );
    }
};



const resgisterUser = asyncHandler(async (req,res) =>{
    const {email,username,password,role} = req.body

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exist ",[])

    }
    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })
        const { unHashedToken, hashedToken, tokenExpiry} =
         user.generateTemporaryToken();

         user.emailVerificationToken = hashedToken
         user.emailVerificationExpiry = tokenExpiry

         await user.save({validateBeforeSave: false});

         await sendmail(
            {
                email: user?.email,
                subject: "please verify your email",
                mailgenContent: emailVerificationmailgenContent(
                    user.username,
                    `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
                ),
            });
         const createdUser = await User.findById(user._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
         );
         if(!createdUser){
            throw new ApiError(500, "Something went wrong while regestering the user")
         }
         return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    {user: createdUser},
                    "User registered successfully and verification email has been sent on your email ",
                )
            )
});

const login = asyncHandler(async (req,res) => {
    const {email,password, username} = req.body
    if( !email){
        throw new ApiError(400," email is required ")
    }
   const user =  await User.findOne({email});

   if(!user){
    throw new ApiError(400,"User does not exists");
   }
   const ispasswordValid = user.ispasswordCorrect(password);
   if(!ispasswordValid){
    throw new ApiError(400,"invalid credentials");
   }

   const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
         );
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
         .status(200)
         .cookie("accessToken", accessToken,options)
         .cookie("refreshToken", refreshToken,options)
         .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "user logged in successfully"
            )
         )

});
const logoutUser =  asyncHandler(async (req,res) => {
    console.log("err1");
    
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
        new: true
        },
     );
     console.log("err2");
     
     const options = {
        httpOnly: true,
        secure: true
     }
     console.log("err3");
     
     return res
          .status(200)
          .clearCookie("accessToken",options)
          .clearCookie("refreshToken",options)
          .json(
          new ApiResponse   (200,{},"User logged out successfully ")
          )
});

export {resgisterUser,login,logoutUser};
