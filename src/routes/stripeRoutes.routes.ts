import { Router } from "express"; 
export const stripeRoutes = Router();
import cors from 'cors';
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

stripeRoutes.post("/payment", cors(), async (req, res)=>{
    let {amount, id} = req.body

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Payment",
            payment_method: id,
            confirm: true
        })

        console.log("Payment", payment)
        res.json({
            message: "Payment was successful",
            success: true
        })
    } catch (error) {
        console.log("Error", error)
        res.json({
            message: "Payment Failed",
            success: false
        })
    }
})