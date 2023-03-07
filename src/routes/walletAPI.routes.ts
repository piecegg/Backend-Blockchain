/** @format */

import { Router } from "express";
import { testHandler } from "../controllers/admin.controller";
export const walletApiRoutes = Router();

walletApiRoutes.get("/fetchAccount", testHandler);
