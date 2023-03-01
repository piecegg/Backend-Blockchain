/** @format */

import { Router } from "express";
import { uploadMetadataHandler } from "../controllers/admin.controller";
export const walletApiRoutes = Router();

walletApiRoutes.get("/uploadMetadata", uploadMetadataHandler);
