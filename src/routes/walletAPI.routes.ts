/** @format */

import { Router } from "express";
import { testHandler } from "../controllers/admin.controller";
import FlowService from "../services/Flow/Flow.service";
export const walletApiRoutes = Router();

walletApiRoutes.get("/fetchAccount", testHandler);

walletApiRoutes.get("/mintIntoAdmin", async (req, res) => {
  try {
    const response = await FlowService.mintNFT(1234567, "0xc2960d8359b67d45");
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
