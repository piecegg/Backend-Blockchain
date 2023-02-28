/** @format */

import { Router } from "express";
import {
  fetchAccountsHandler,
  createAccountHandler,
} from "../controllers/wallet.controller";
export const walletApiRoutes = Router();

walletApiRoutes.get("/accounts", fetchAccountsHandler);

walletApiRoutes.post("/account", createAccountHandler);
