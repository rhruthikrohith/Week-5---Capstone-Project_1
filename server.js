import exp from "express"
import {connect} from 'mongoose'
import { config } from "dotenv";
import { authorroute } from "./APIS/authorapi.js";
import { adminroute } from "./APIS/adminapi.js";
import { userroute } from "./APIS/userapi.js";
import cookieParser from "cookie-parser";
import { commonrouter } from "./APIS/coomonapi.js";
config();//process.env

const app=exp();
//add body parser middleware
app.use(exp.json())
//cokie parser middleware
app.use(cookieParser())
app.use('/user-api',userroute)
app.use('/admin-api',adminroute)
app.use('/author-api',authorroute)
app.use('/common-api',commonrouter)
const connectdb=async()=>{
    try{
    await connect(process.env.DB_URL)
    console.log("db connection success")
    app.listen(process.env.PORT,()=>console.log("server started"))
    }
    catch(err)
    {
console.log("error",err)
    }
}
connectdb()

//dealing with invalid path
app.use((req,res,next)=>{
res.json({message:`${req.url} is invalid path`})
})

//error handling
app.use((err,req,res,next)=>{
    console.log("error occured",err)
    res.json({message:"error occured",reason:err.message})
})

// let a=10,b=20;
// //template literal
// console.log(`a is {$a} b is {$b}`)