import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { usermodel } from "../schemas/usermodel.js";
import { hash } from "bcryptjs";
//register function

export const register= async(userobj)=> {
//creste document
    const userdoc= new usermodel(userobj)
//validate for empty password
    await userdoc.validate();
//hash and replace password
    userdoc.password=await bcrypt.hash(userdoc.password,10)
//save
    const created= await userdoc.save()
//convert document to object to password
    const newuserobj= created.toObject();
//remove password
    delete newuserobj.password;
//return userobj without password
    return newuserobj
};


//authenticate function

export const authenticate= async({ email, password})=>{
 
    const user= await usermodel.findOne({email})
    if (!user)
    {
        const error= new Error("invalid user");
        error.status=400;
        throw error;
    }
     //compare password
    const macth= await bcrypt.compare(password,user.password)
    if(!macth)
    {
        const err= new Error("invalid password");
        err.status=400;
        throw err;        
    }
    //generate token
    const token=jwt.sign({userid: user._id,role:user.role,email:user.email},
        process.env.JWT_SECRET,
        { expiresIn: "1h"})
        const userobj=user.toObject();
        delete userobj.password;

        return {token, user:userobj}
}