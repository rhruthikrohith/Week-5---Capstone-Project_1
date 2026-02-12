import  jwt  from "jsonwebtoken";
export const verifytoken=async(req,res,next)=>{
    
    //read token from req
    let token=req.cookies.token;
    console.log(token)
    if(!token)
        return res.status(400).json({message:"token isnot created"})
    //verify by validity--decoding of token
    let decodedtoken=jwt.verify(token,process.env.JWT_SECRET)
        //forward req to next middleware/route
        next();
};
    


