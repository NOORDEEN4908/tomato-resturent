import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true}, // if user allready  have a account they can't creat a another account
  password:{type:String,required:true},
  cartData:{type:Object,default:{}},
  diet:{type:String,default:""},
  allergies:{type:[String],default:[]},
  dislikes:{type:[String],default:[]},
  pastOrders:{
    type:[{
      orderId:{type:mongoose.Schema.Types.ObjectId,ref:"order"},
      amount:{type:Number,default:0},
      products:{type:[String],default:[]},
      itemCount:{type:Number,default:0},
      date:{type:Date,default:Date.now}
    }],
    default:[]
  }
},{minimize:false})

const userModel =mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;