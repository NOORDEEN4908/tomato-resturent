import orderModel from "../models/orderModel.js";
import userModel from "../models/usermodels.js";
import Stripe from "stripe"


const stripe =new Stripe(process.env.STRIPE_SECRET_KEY)


const extractProductIds=(items=[])=>{
return items.map((item)=>item.itemId ||item.productId ||item._id).filter(Boolean)
}




// placing user order from frontend
const placeOrder= async (req,res)=>{
const frontend_url= "http://localhost:5173"
const { paymentMethod = "card", isPaid = false } = req.body;

// for creat a new order we use try bloak
try {
    const newOrder= new orderModel({
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address,
        paymentMethod,
        payment: paymentMethod === "cash" ? Boolean(isPaid) : false,
    })
    await newOrder.save(); // save the order in the database
    const productIds=extractProductIds(newOrder.items);


    await userModel.findByIdAndUpdate(req.body.userId,
        {
            $set:{cartData:{}},
            $push:{
                pastOrders:{
           orderId:newOrder._id,
           amount:newOrder.amount,
           products:productIds,
           itemCount:newOrder.items.length,
           date:newOrder.date
        }
            }
        });  
    
    // If cash, no Stripe checkout—just confirm the order
    if (paymentMethod === "cash") {
        return res.json({
            success:true,
            paymentMethod:"cash",
            payment:newOrder.payment,
            orderId:newOrder._id,
            message:newOrder.payment ? "Cash collected" : "Cash on delivery - payment pending"
        });
    }
    
    // cleaning the user cart data

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
res.json({success:true,session_url:session.url,paymentMethod:"card"})




} catch (error) {

    console.log(error)
    res.json({success:false,message:"ERROR"})
    
}

}

const varifyOrder =async (req,res)=>{
const {orderId,success} =req.body;

   try {
    const orderRecord=await orderModel.findById(orderId);
    if (!orderRecord) {
        return res.json({success:false,message:"Order not found"})
    }
    if (orderRecord.paymentMethod === "cash") {
        return res.json({success:false,message:"Cash orders are not verified via Stripe"})
    }
    if (success=="true") {

        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"paid"})
        
    }else{
await orderModel.findByIdAndDelete(orderId);
if(orderRecord?.userId){
    await userModel.findByIdAndUpdate(orderRecord.userId,
        {
            $pull:{
                pastOrders:{orderId:orderId}
            }
        });


}
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

export const updatePaymentStatus = async (req,res)=>{
    try {
        const { orderId, paid, status } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({success:false,message:"Order not found"});
        }
        if (order.paymentMethod !== "cash") {
            return res.json({success:false,message:"Only cash orders can update payment status manually"});
        }

        const updateFields = { payment: Boolean(paid) };
        if (status) updateFields.status = status;

        await orderModel.findByIdAndUpdate(orderId, updateFields);
        return res.json({success:true,message:"Payment status updated",payment:updateFields.payment,status:updateFields.status || order.status});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"ERROR"})
    }
}

export const deleteOrder = async (req,res)=>{
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({success:false,message:"Order not found"});
        }

        // remove order reference from user's pastOrders if present
        if (order.userId) {
            await userModel.findByIdAndUpdate(order.userId,{
                $pull:{ pastOrders:{ orderId: order._id } }
            });
        }

        await orderModel.findByIdAndDelete(orderId);
        return res.json({success:true,message:"Order deleted"});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"ERROR"});
    }
}

export const getUserOrderHistory=async(req,res)=>{
const {userId}=req.params;

try {
const orders=await orderModel.find({userId});
const noramalizedOrders=orders.map((order)=>{
const ids=order.items?.map((item)=>item._id||item.id||item.itemId||item.productId).filter(Boolean)||[];
if(ids.length<1){
    return ids[0]||null;
}
return ids;
}).filter((entry)=>entry&&entry.length!==0);
res.json({success:true,data:noramalizedOrders})


    
} catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
    
}







}