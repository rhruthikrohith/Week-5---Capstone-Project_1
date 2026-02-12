
import exp from "express";
import { register, authenticate } from "../services/authservice.js";
export const userroute=exp.Router()
import { checkauthor } from "../middleware/checkauthor.js";
import { verifytoken } from "../middleware/verifytoken.js";
import { articlemodel } from "../schemas/articlemodel.js";
import { usermodel } from "../schemas/usermodel.js";
//register user

userroute.post('/users',async(req,res)=>{
    //get userobj from req
    let userobj=req.body;
    // call register
  const newuserobj=await register({...userobj,role:"USER"})
 res.status(201).json({message:"user created",newuserobj})
})
//authenticate user

userroute.post('/user',async(req,res)=>{
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
//read all articles
userroute.get('/readusers',verifytoken,async(req,res)=>{
    //get all articles
    let articles=await articlemodel.find({isarticleactive:true}).populate("author","firstname email")
    //send res
     res.status(201).json({message:"token created",articles})
})
userroute.put('/updateusers', verifytoken, async (req, res) => {
  let { user, comment, articleid } = req.body;

  // check article exists
  let article = await articlemodel.findById(articleid);

  // push comment,user into comments array
  let updatedarticle = await articlemodel.findByIdAndUpdate(
    articleid,
    { $push: { comments:{ user: user,comment:comment} } },
    { new: true }
  )
  res.status(200).json({
    message: "comment added",
    updatedarticle
  });
});

