/** @format */
//@ts-ignore
import flowScripts from "../Flow/FlowScripts.js";
import { uploadMetadata, fetchAccount } from "../services/walletAPI.service";

export const uploadMetadataHandler = async (req: any, res: any) => {
  try {
    const response = await uploadMetadata(
      43246,
      "Testing metadata creation for Pieces NFTs",
      "/Alex1.png",
      "ipfs://bafybeihkurbbjxq5v7ag62ahvatrvizmv4tqebzzm26nz6ils4nxgh5ko4"
    );
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

export const fetchAccountHandler = async (req: any, res: any) => {
  try {
    console.log("CALLED", req.body.address);
    const response = await fetchAccount(req.body.address);
    console.log(response);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
