/** @format */

import { mintNFT, uploadMetadata } from "../Flow/actions";

export const uploadMetadataHandler = async (req: any, res: any) => {
  try {
    const response = await uploadMetadata(
      "First test",
      "Testing metadata creation for Pieces NFTs",
      "/Alex1.png",
      "ipfs://bafybeihkurbbjxq5v7ag62ahvatrvizmv4tqebzzm26nz6ils4nxgh5ko4"
    );
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
