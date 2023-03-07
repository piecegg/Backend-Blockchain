/** @format */

import AxiosService from "../Axios/Axios.service";
// Need to change these imports
import { uploadMetadata as uploadMetadataScript } from "./flowScripts/uploadMetadata";
import { setupAccount as setupAccountScript } from "./flowScripts/setupAccount";
import { mintNFT as mintNFTScript } from "./flowScripts/mintNFT";

class FlowService {
  async setupAccount(accountAddress: string) {
    try {
      let data = JSON.stringify({
        code: setupAccountScript(),
      });
      const response = await AxiosService.post(
        `/accounts/${accountAddress}/transactions`,
        data
      );
      return response;
    } catch (error) {
      console.log(
        error,
        `Error when trying to setup account:${accountAddress} with the Pieces Collection`
      );
      return error;
    }
  }

  // Upload Metadata to the Pieces contract
  async uploadMetadata(
    _twitterId: number,
    _description: string,
    _image: string,
    _ipfsCID: string
  ) {
    try {
      var data = JSON.stringify({
        code: uploadMetadataScript(),
        arguments: [
          {
            type: "UInt64",
            value: _twitterId.toString(),
          },
          {
            type: "String",
            value: _description,
          },
          {
            type: "String",
            value: _image,
          },
          {
            type: "String",
            value: _ipfsCID,
          },
        ],
      });

      const response = await AxiosService.post(
        "/accounts/0x1ad3c2a8a0bca093/transactions",
        data
      );
      return response;
    } catch (error) {
      console.log(error, "Error when trying to upload Metadata the contract");
      return error;
    }
  }

  async mintNFT(metadataId: number, address: string) {
    try {
      let data = JSON.stringify({
        code: mintNFTScript(),
        arguments: [
          {
            type: "UInt64",
            value: metadataId.toString(),
          },
          {
            type: "Address",
            value: address,
          },
        ],
      });
      const response = await AxiosService.post(
        "/accounts/0x1ad3c2a8a0bca093/transactions",
        data
      );
      return response;
    } catch (error) {
      console.log(
        error,
        `Error when trying to mint NFT into account:${address}`
      );
    }
  }
}

export default new FlowService();
