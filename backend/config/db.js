import mongoose from "mongoose";


export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://ecommace:ecommace@cluster0.kbos8yr.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}