import exp from "express";
import { register, authenticate } from "../services/authservice.js";
import { usermodel } from "../schemas/usermodel.js";
import { articlemodel } from "../schemas/articlemodel.js";
import { checkauthor } from "../middleware/checkauthor.js";
import { verifytoken } from "../middleware/verifytoken.js";
export const authorroute=exp.Router()


//register author
authorroute.post('/register',async(req,res)=>{
    //get userobj from req
    let userobj=req.body;
    // call register
  const newuserobj=await register({...userobj,role:"AUTHOR"})
 res.status(201).json({message:"author created",newuserobj})
})
//authenticate auuthor
authorroute.post('/authenticate',async(req,res)=>{
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
authorroute.post('/article', async (req, res) => {
  let userobj = req.body;

  // check author exists
  const newobj = await usermodel.findById(userobj.author);
  if (!newobj) {
    const error = new Error("invalid author");
    error.status = 400;
    throw error;
  }
  const authordoc = new articlemodel({
    author: userobj.author,
    title: userobj.title,
    category: userobj.category,
    content: userobj.content
  });

  // save article
  let created = await authordoc.save();

  res.status(201).json({ message: "article created", created });
});

authorroute.get('/rarticle/:id',checkauthor,async(req,res)=>
{
    //get author id
    let authid=req.params.id
   let articles=await articlemodel.find({author:authid,isarticleactive: true}).populate("author","firstname email")
   res.status(201).json({message:"articles",articles})
})

authorroute.put("/articles",verifytoken, checkauthor, async (req, res) => {
  let { articleid, title, category, content, author } = req.body;

  let articles = await articlemodel.findOne({ _id: articleid, author: author });
  if (!articles) {
    return res.status(404).json({ message: "not found" });
  }

  // update article
  let updatedarticle = await articlemodel.findByIdAndUpdate(
    articleid,
    { $set: { title, category, content } },
    { new: true }
  );

  // SEND RESPONSE
  res.json({ message: "article updated", updatedarticle });
});

