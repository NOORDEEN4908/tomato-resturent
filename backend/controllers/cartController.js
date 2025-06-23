import userModel from "../models/usermodels.js";

// add items to cart
const addToCart =async(req,res)=>{


try {
    
let userData = await userModel.findOne({_id:req.body.userId});
let cartData =await userData.cartData;

if(!cartData[req.body.itemId]){
    cartData[req.body.itemId] =1

}
else{
cartData[req.body.itemId] +=1

}

await userModel.findByIdAndUpdate(req.body.userId,{cartData});
res.json({success:true,message:"add to cart"})



} catch (error) {
    
console.log(error)
res.json({success:false,message:"something went wrong"})


}
        



}


//remove items from user cart
const removeFromCart=async(req,res)=>{

    try {
        
let userData =await userModel.findById(req.body.userId)   // we gat the user data to find the user by ID
let cartData= await userData.cartData; //and we store the data using  user data using cart data

if(cartData[req.body.itemId]>0){           // and we write logic to remove from cart
cartData[req.body.itemId] -=1;
}
await userModel.findByIdAndUpdate(req.body.userId,{cartData});
res.json({success:true,message:"remove from cart"})


    } catch (error) {
       
        console.log(error)
        res.json({success:false,message:"ERROR"})

    }

}

//featch user cart data

const getCart =async (req,res)=>{
    try {

        let userData= await userModel.findById(req.body.userId)
        let cartData =await userData.cartData;    // user cart data will store  in this  variable 

        res.json({success:true,cartData})
        
    } catch (error) {
        console.log(error)

        res.json({success:false,message:"Error"})



    }

}

export {addToCart,removeFromCart,getCart}