/** @format */
import AxiosService from "../Axios/Axios.service";

class WalletService {
  async createAccount() {
    try {
      const response = await AxiosService.post("/accounts?sync=nonez");
      return response;
    } catch (error) {
      console.log(error, "Error when creating a new account");
    }
  }

  async fetchAccounts() {
    try {
      const response = await AxiosService.get("/accounts");
      return response;
    } catch (error) {
      console.log(error, "Error when fetching accounts from API");
    }
  }

  async fetchAccount(accountAddress: string) {
    try {
      const response = await AxiosService.get(`/accounts/${accountAddress}`);
      return response;
    } catch (error) {
      console.log(
        error,
        `Error when fetching account:${accountAddress} from API`
      );
    }
  }
}

export default new WalletService();
