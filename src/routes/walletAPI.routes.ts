/** @format */

import { Router } from "express";
import {
  uploadMetadataHandler,
  testHandler,
} from "../controllers/admin.controller";
export const walletApiRoutes = Router();

walletApiRoutes.post("/uploadMetadata", uploadMetadataHandler);
walletApiRoutes.get("/fetchAccount", testHandler);
