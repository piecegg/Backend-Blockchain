/** @format */

import { Router } from "express";
import WalletApiClient from "../controllers/lib/walletApi";
import {
  adminAddress,
  baseUrl,
  fusdTokenName,
} from "../controllers/lib/config";

const walletApi = new WalletApiClient(baseUrl);
export const walletApiRoutes = Router();

walletApiRoutes.get("/accounts", async function get(req, res) {
  const accounts = await walletApi.getAccounts();

  /*   const result = await Promise.all(
    accounts.map(async (account) => ({
      address: account.address,
      isAdmin: account.address === adminAddress,
    }))
  ); */
  console.log(accounts);
  res.send(accounts.data);
});
