/** @format */

import { NextFunction, Request, Response } from "express";
import { fetchAccounts, createAccount } from "../services/walletAPI.service";

export const fetchAccountsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accounts = await fetchAccounts();
  res.send(accounts);
};

export const createAccountHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const account = await createAccount(req.body.uniqueKey);
  res.send(account);
};
