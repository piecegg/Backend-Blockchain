/** @format */
import axios from "axios";
import { setupAccount as setupAccountCode } from "../Flow/actions";

export const fetchAccounts = async () => {
  var config = {
    method: "get",
    url: "https://piece.herokuapp.com/v1/accounts",
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const createAccount = async (IdempotencyKey: string) => {
  var config = {
    method: "post",
    url: "https://piece.herokuapp.com/v1/accounts?sync=nonez",
  };
  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const setupAccount = async (address: string) => {
  var data = JSON.stringify({
    code: setupAccountCode(),
  });

  var config = {
    method: "post",
    url: "https://piece.herokuapp.com/v1/accounts/0x1551e7bac5519a9d/transactions",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};
