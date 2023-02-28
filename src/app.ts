/** @format */

import * as dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response, response } from "express";
import cors from "cors";
import AppError from "./utilities/appError";
import cookieSession from "cookie-session";

import cookieParser from "cookie-parser"; // parse cookie header
import { walletApiRoutes } from "./routes/walletAPI";
/* import { authRoutes } from './routes/authRoutes';
import passport from 'passport';
import mongoose from 'mongoose';
import { twitterMentions } from './utilities/twitterMentions'; */

const app = express(),
  port = process.env.PORT || 8000;

/* mongoose.connect(process.env.MONGODB_URI as string, () => {
  console.log("connected to mongo db");
}); */

async function bootstrap() {
  // MIDDLEWARE
  app.use(
    cookieSession({
      name: "session",
      keys: [process.env.COOKIE_KEY as string],
      secret: "UUpLrNbGzAdypcEPNNQocsbAUBR8YdepNrliqaP",
      maxAge: 24 * 60 * 60 * 100,
    })
  );
  //  twitterMentions()
  // 1.Body Parser
  app.use(express.json({ limit: "10kb" }));
  // parse cookies
  app.use(cookieParser());

  // initalize passport
  //  app.use(passport.initialize());
  // deserialize cookie from the browser

  //  app.use(passport.session());
  // set up cors to allow us to accept requests from our client
  app.use(
    cors({
      origin: process.env.ORIGIN_URL, // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // allow session cookie from browser to pass through
    })
  );

  // set up routes
  app.use("/walletApi", walletApiRoutes);
  //  app.use("/auth", authRoutes);

  const authCheck = function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      res.status(401).json({
        authenticated: false,
        message: "user has not been authenticated",
      });
    } else {
      next();
    }
  };

  // if it's already login, send the profile response,
  // otherwise, send a 401 response that the user is not authenticated
  // authCheck before navigating to home page
  app.get("/", authCheck, (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      authenticated: true,
      message: "user successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  });

  // UNHANDLED ROUTES
  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
  });

  // GLOBAL ERROR HANDLER
  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  app.listen(port, () => {
    console.log(`Server on port: ${port}`);
  });
}

bootstrap().catch((err) => {
  throw err;
});
