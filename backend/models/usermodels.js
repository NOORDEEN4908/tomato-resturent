import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,reuired:true,unique:true}, // if user allready  have a account they can't creat a another account
  password:{type:String,required:true},
  cartData:{type:Object,default:{}}
},{minimize:false})

const userModel =mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;