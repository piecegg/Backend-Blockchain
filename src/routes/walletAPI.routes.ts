/** @format */

import { Router } from "express";
import {
  uploadMetadataHandler,
  fetchAccountHandler,
} from "../controllers/admin.controller";
export const walletApiRoutes = Router();

walletApiRoutes.get("/uploadMetadata", uploadMetadataHandler);
walletApiRoutes.get("/fetchAccount", fetchAccountHandler);
