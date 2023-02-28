/** @format */
import axios from "axios";

export const fetchAccounts = async () => {
  var config = {
    method: "get",
    url: "http://localhost:3000/v1/accounts",
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const createAccount = async (IdempotencyKey) => {
  var config = {
    method: "post",
    url: "http://localhost:3000/v1/accounts?sync=nonez",
    headers: {
      "Idempotency-Key": IdempotencyKey,
    },
  };
  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};
