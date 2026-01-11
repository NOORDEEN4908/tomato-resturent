import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, varifyOrder,userOrders, listOrders ,updateStatus, updatePaymentStatus, deleteOrder } from "../controllers/orderController.js"

const orderRouter= express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",varifyOrder)
orderRouter.post("/userorders",authMiddleware,userOrders)
orderRouter.get("/list",listOrders)
orderRouter.post("/status",updateStatus)
orderRouter.post("/payment",updatePaymentStatus)
orderRouter.post("/delete",deleteOrder)


export default orderRouter;
