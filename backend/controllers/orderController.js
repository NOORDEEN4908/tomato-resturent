import orderModel from "../models/orderModel.js";
import userModel from "../models/usermodels.js";
import Stripe from "stripe"


const stripe =new Stripe(process.env.STRIPE_SECRET_KEY)

// pacing user order from frontend
const placeOrder= async (req,res)=>{

const frontend_url= "http://localhost:5174"

// for creat a new order we use try bloak
try {
    const newOrder= new orderModel({
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address
    })
    await newOrder.save(); // save the order in the database
    await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});  // cleaning the user cart data

    const line_items= req.body.items.map((item)=>({   // whataver item we gat from user we creat a line items which nessary for stripe payment

        price_data:{
            currency:"lkr",
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100*80
        },
        quantity:item.quantity

    }))

    line_items.push({   // after the item we anter the delivery charges we multiply into get a slr
        price_data:{
            currency:"lkr",
            product_data:{
                name:"Delivery Charges"
            },
            unit_amount:2*100*80
        },
        quantity:1
    })

    const session=await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:"payment",
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
     cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`

})
res.json({success:true,session_url:session.url})




} catch (error) {

    console.log(error)
    res.json({success:false,message:"ERROR"})
    
}

}

const varifyOrder =async (req,res)=>{
const {orderId,success} =req.body;

   try {
    if (success=="true") {

        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"paid"})
        
    }else{
        await orderModel.findByIdAndDelete(orderId)
        res.json({success:false,message:"NOT PAID"})
    }
    
   } catch (error) {
    
    console.log(error);
    res.json({success:false,message:"ERROR"})
   }
}

// user orders for frontend 

const userOrders =async (req,res)=>{

    try {
        const orders= await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
        
    } catch (error) {
        console.log(error)
    res.json({success:false,message:"ERROR"})
        
    }

}

// listing orders fro admin panale api created
 const listOrders =async (req,res)=>{

    try {
        const orders=await orderModel.find({}); // using this we can get all the orders
        res.json({success:true,data:orders})
 } catch (error) {
        
console.log(error)
res.json({success:false,message:"ERROR"})

    }

 }


// api from updating order status

const updateStatus=async (req,res)=>{

try {
    
await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
res.json({success:true,message:"Status Updated"})



} catch (error) {

    console.log(error);
    res.json({success:false,message:"ERROR"})
    
}

}



export {placeOrder,varifyOrder,userOrders,listOrders,updateStatus}