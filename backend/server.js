import express from"express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import { listProducts } from "./controllers/foodController.js"
import { getUserOrderHistory } from "./controllers/orderController.js"
import { getCartByUserId } from "./controllers/cartController.js"



// app config
const app = express()

const port = 4000

//middleware
//use this to access backend to frontend
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
  credentials: true
}))

//db connection
connectDB();

//api endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.get("/api/products",listProducts)
app.get("/api/users/:userId/orders",getUserOrderHistory)
app.get("/api/users/:userId/cart",getCartByUserId)


app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

//mongodb+srv://ecommace:ecommace@cluster0.kbos8yr.mongodb.net/?
