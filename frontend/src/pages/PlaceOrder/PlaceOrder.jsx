import React, { useContext, useEffect, useState } from 'react'
import "./PlaceOrder.css"
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

  const [data,setData] =useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const [paymentMethod,setPaymentMethod]=useState("card")

const onChangeHandler =(event)=>{
  const name=event.target.name;
  const value =event.target.value;
  setData(data =>({...data,[name]:value}))
}

useEffect(()=>{
  console.log(data);

},[data])

const placeOrder = async (event)=>{
  event.preventDefault();
  
  let orderItems =[];
  food_list.map((item)=>{
    if(cartItems[item._id]>0){

      let itemInfo =item;
      itemInfo["quantity"]=cartItems[item._id];
      orderItems.push(itemInfo);
    }
  })

  let orderData={  // genarate the order data
    address:data,
    items:orderItems,
    amount:getTotalCartAmount()+2,
    paymentMethod,
    isPaid:false
  }
  let response =await axios.post(url+"/api/order/place",orderData,{headers:{token}})  // send the order data to the api

  if (response.data.success) {
    const {session_url} =response.data;
    if(paymentMethod==="card" && session_url){
      window.location.replace(session_url);
    }else{
      toast.success(response.data.message || "Cash order placed");
      navigate("/userorders")
    }
  }
  else{
   toast.error("Error placing order")
  }
}

const navigate=useNavigate()


useEffect(()=>{
if (!token) {
  navigate('/cart')
  }
  else if(getTotalCartAmount()===0){
    navigate('/cart')
  }
},[token])



  return (
    <form onSubmit={placeOrder} className='place-order' >
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required    name='firstName' onChange={onChangeHandler} value={data.firstName}  type="text" placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName}  type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email}  type="text" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required  name='city' onChange={onChangeHandler} value={data.city}   type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state}  type="text" placeholder='State' />
        </div>
       
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
          <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs.{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs.{ getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
            </div>
           

          </div>
          <div className="payment-method">
            <h3>Payment Method</h3>
            <label className={`payment-option ${paymentMethod==="card" ? "active" : ""}`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod==="card"}
                onChange={()=>setPaymentMethod("card")}
              />
              <span className="icon">💳</span>
              <span>Card </span>
            </label>
            <label className={`payment-option ${paymentMethod==="cash" ? "active" : ""}`}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod==="cash"}
                onChange={()=>setPaymentMethod("cash")}
              />
              <span className="icon">💵</span>
              <span>Cash on Delivery</span>
            </label>
          </div>
          <button type='submit' >PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder  