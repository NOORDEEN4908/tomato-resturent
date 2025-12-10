import userModel from "../models/usermodels.js";
import foodModel from "../models/foodModel.js";


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


const calculateCartTotal=(cartItems={},products=[])=>{
    const priceMap=new Map(products.map((item)=>[item._id.toString(),item.price]));
    return Object.keys(cartItems).reduce((total,productId)=>{
const qty=cartItems[productId]||0;
const noramalizeId=productId.toString();
const price=priceMap.get(noramalizeId)||0;
return total+(price * qty);
    
},0)
}


const verifyCart=async(req,res)=>{

try {
    const {cartItems}=req.body;
    const productIds=Object.keys(cartItems);
    const products= await foodModel.find({_id:{$in:productIds}});
    const backendTotal=calculateCartTotal(cartItems,products);

res.json({
success:true,
backendTotal,
updatedProduct:products
});

} catch (error) {
    console.log(error);
    res.json({success:false,message:"Verification error"})
    }
};

 






const getCartByUserID=async(req,res)=>{

try {

const {userId}=req.params;
const userData=await userModel.findById(us);
if(!userData){
    return res.json({success:false,message:"user not Found"})
}

const cartItems=userData.cartData||{}; length
const productIds=Object.keys(cartItems);
const products=productIds.length?await foodModel.find({_id:{$in:productIds}}):[];
const cartTotal=calculateCartTotal(cartItems,products)
res.json({success:true,cartItems,cartTotal})

} catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
}

}










 
export {addToCart,removeFromCart,getCart,getCartByUserID,verifyCart}