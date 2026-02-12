import exp from "express";
import { authenticate } from "../services/authservice.js";
import { usermodel } from "../schemas/usermodel.js";
import { verifytoken } from "../middleware/verifytoken.js";
import { hash } from "bcryptjs";
import bcrypt from "bcryptjs";
export const commonrouter=exp.Router()


//login
commonrouter.post("/authenticate-login",async(req,res)=>{
let userobj=req.body;
//call authenticate service
let {token,user}=await authenticate(userobj)
//save token as httponlycookie
res.cookie("token",token,{
    httpOnly:true,
    sameSite:"lax",
    secure:false
})
 res.status(201).json({message:"token created",user})
});

//logout
commonrouter.get("/logout",async(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:'lax'
    });
    res.status(200).json({message:"logged out sucessfully"})

})
commonrouter.put("/change-password",verifytoken,async(req,res)=>{
    //get current password and new password
    let {email,password,newpassword}=req.body
    //find by email
    let existinguser=await usermodel.findOne({email})
    if (!existinguser)
    {
         return res.status(400).json({ message: "invalid user" });
    }
    //check current password is correct
    let check=await bcrypt.compare(password,existinguser.password)
      if (!check) {
     return res.status(400).json({ message: "invalid password" });
  }
  let hashedpassword= await bcrypt.hash(newpassword,10)
  existinguser.password=hashedpassword
  await existinguser.save()
res.status(200).json({ message: "new password saved"});
    //replace current password with new passsword
    //get new password
})