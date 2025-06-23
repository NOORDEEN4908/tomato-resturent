import userModel from "../models/usermodels.js";
import jwt from "jsonwebtoken" //use for user authantication
import bcrypt from "bcrypt"
import validator from "validator"
import { response } from "express";

// login user
const loginUser=async(req,res)=>{
    const {email,password}=req.body;

    try {
        const user =await userModel.findOne({email})

        if(!user){
         return res.json({success:false,message:"User dosen't not exist"})
        }

const isMatch=await bcrypt.compare(password,user.password)

if(!isMatch){
    return res.json({success:false,message:"Invalid creadentials"})
}

const token=createToken(user._id);
res.json({success:true,token})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser=async(req,res)=>{
const{name,password,email}=req.body;
try {
    // checking is user already exist 
    const exists=await userModel.findOne({email});
    if(exists){
        return res.json({success:false,message:"User already exist"})
    }
    // validate email formate and strong passwor
    if (!validator.isEmail(email)) {
        return res.json({success:false,message:"Pless enter valid email"})
    }
if(password.length<8){
    return res.json({success:false,message:"Please enter strong password"})
}
// hashing user password or encript password
const salt =await bcrypt.genSalt(10)
const hashedPassword=await bcrypt.hash(password,salt)

//new user
const newUser=new userModel({
    name:name,
    email:email,
    password:hashedPassword
})
//save user
const user= await newUser.save()
const token=createToken(user._id)
res.json({success:true,token})



} catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
}
}


export{loginUser,registerUser}


