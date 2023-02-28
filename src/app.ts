import express, { NextFunction, Request, Response, response } from 'express';
import cors from 'cors';
import AppError from './utilities/appError';
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const
  app = express(),
  port = process.env.PORT || 8000


async function bootstrap() {
  // MIDDLEWARE

  // 1.Body Parser
  app.use(express.json({ limit: '10kb' }));

  // 2. Cors
  app.use(cors());


  // UNHANDLED ROUTES
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
  });

  // GLOBAL ERROR HANDLER
  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  app.listen(port, () => {
    console.log(`Server on port: ${port}`);
  });

  app.post("/payment", cors(), async (req, res)=>{
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
}

bootstrap()
  .catch((err) => {
    throw err;
  })