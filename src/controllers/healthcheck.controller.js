import {ApiResponse} from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handeler.js";

// const healthCheck = (req, res) =>{
//     try {
//         res.status(200).json(
//             new ApiResponse(200, {message: "server is Running"}));

        
//     }catch (error) {

//     }
// };
const healthCheck = asyncHandler(async (requestAnimationFrame,res)=>{
    res.status(200).json(new ApiResponse(200, { message: "server is running "}))
});
 export { healthCheck };