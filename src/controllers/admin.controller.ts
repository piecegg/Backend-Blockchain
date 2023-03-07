/** @format */
//@ts-ignore
import flowScripts from "../Flow/FlowScripts.js";
import { FlowLogicHandler } from "../utilities/FlowLogic";

export const testHandler = async (req: any, res: any) => {
  try {
    const response = await FlowLogicHandler(1234567, "textTest for NFT");
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
