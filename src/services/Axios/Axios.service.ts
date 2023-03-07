/** @format */
import axios from "axios";

class AxiosService {
  async get(url: string) {
    const config = {
      method: "get",
      url: `${process.env.WALLET_API}${url}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const result = await axios(config)
      .then(function (response: any) {
        return response.data;
      })
      .catch(function (error: any) {
        console.log("Axios Get request error");
        console.log(error);
      });

    return result;
  }

  async post(url: string, data?: string): Promise<any> {
    const config = {
      method: "post",
      url: `${process.env.WALLET_API}${url}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios(config)
      .then(function (response: any) {
        return response.data;
      })
      .catch(function (error: any) {
        console.log("Axios Post request error");
        console.log(error);
      });

    return result;
  }
}

export default new AxiosService();
