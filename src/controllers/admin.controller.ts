/** @format */
//@ts-ignore
import { FlowLogicHandler } from "../utilities/FlowLogic";

export const testHandler = async (req: any, res: any) => {
  try {
    const response = await FlowLogicHandler(
      1234567,
      "textTest for NFT number 2"
    );
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
