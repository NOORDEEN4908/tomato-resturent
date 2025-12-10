import foodModel from "../models/foodModel.js";
import fs from'fs'



//-- help to normalize responses for personalization--//

const formatProductResponse=(foodDoc)=>({
id:foodDoc._id,
_id:foodDoc._id,
name:foodDoc.name,
description:foodDoc.description,
price:foodDoc.price,
category:foodDoc.category,
image:foodDoc.image,
season:foodDoc.season||"all",

})


//add food Item

const addFood= async(req,res)=>{

    let image_filename=`${req.file.filename}`;

    const food=new foodModel ({

        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
        season:req.body.season||"all",
    
    })
    try {
        await food.save();
        res.json({success:true,message:"Food Added"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }

}
// all food list
const listFood=async (req,res)=>{
    
    try {
        const foods=await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"});
        
    }

}


const listProducts =async (req,res)=>{
try {
    
const filter={};
if(req.query.category&&req.query.category!="All"){
filter.category=req.query.category;
}
const foods=await foodModel.find(filter);
res.json({success:true,data:foods.map(formatProductResponse)})



} catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
    
}

}


// remove food item

const removeFood=async (req,res)=>{
    try {
        const food=await foodModel.findById(req.body.id); //find the food model by using id
        fs.unlink(`uploads/${food.image}`,()=>{}) //delete the image frome the folder

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }

}



export {addFood,listFood,removeFood,listProducts}