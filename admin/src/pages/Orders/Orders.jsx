import React from 'react'
import'./Orders.css'
import { useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import {assets} from '../../assets/assets'



const Orders = ({url}) => {

const [Orders,setOrders]=useState([]);

const fetchAllOrders=async ()=>{
const response =await axios.get(url+"/api/order/list"); //we get all the data to responce

if (response.data.success) {
  setOrders(response.data.data);
  console.log(response.data.data)
}
else{
  toast.error("Error")

}
}

const statusHandler=async (event,orderId)=>{

const response=await axios.post(url+"/api/order/status",{
  orderId,
  status:event.target.value
})

if(response.data.success){
  await fetchAllOrders();
}

}

const paymentHandler=async (orderId, paid)=>{
  const response = await axios.post(url+"/api/order/payment",{
    orderId,
    paid
  });
  if(response.data.success){
    await fetchAllOrders();
    toast.success("Payment status updated");
  }else{
    toast.error(response.data.message || "Error updating payment");
  }
}

const deleteHandler = async(orderId)=>{
  const confirmed = window.confirm("Delete this order?");
  if(!confirmed) return;
  const response = await axios.post(url+"/api/order/delete",{orderId});
  if(response.data.success){
    toast.success("Order deleted");
    await fetchAllOrders();
  }else{
    toast.error(response.data.message || "Error deleting order");
  }
}

useEffect(()=>{

fetchAllOrders();

},[])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {Orders.map((order,index)=>(
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>

                {order.items.map((item,index)=>{
                  if (index===order.items.length-1) {
                    return item.name+"x"+item.quantity
                    
                  }else{
                    return item.name+"x"+item.quantity +","
                  }

                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName+" "+order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street+", "}</p>
                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", " +order.address.zipcode}</p>
               </div>
               <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items:{order.items.length}</p>
            <p>${order.amount}</p>
           
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>

            </select>
            <button className="btn-delete" onClick={()=>deleteHandler(order._id)}>Delete</button>
            <p>Payment: {order.payment ? "Paid" : "Unpaid"} ({order.paymentMethod || "card"})</p>
            {order.paymentMethod === "cash" && (
              <div className="payment-actions">
                <button className="btn-paid" onClick={()=>paymentHandler(order._id,true)} disabled={order.payment}>Mark Paid</button>
                {!order.payment && (
                  <button className="btn-unpaid" onClick={()=>paymentHandler(order._id,false)} disabled={!order.payment}>Mark Unpaid</button>
                )}
              </div>
            )}
           
         
            </div>
            


        ))}

      </div>



    </div>
  )
}

export default Orders