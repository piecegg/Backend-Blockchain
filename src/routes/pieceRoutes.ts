import { Router } from "express"; 
export const pieceRoutes = Router();
import { Piece } from "../models/pieceModel";
import cors from 'cors';

pieceRoutes.post("/listingPiece", cors(), async (req, res)=>{

    let { id} = req.body

    try {
        let pieceDetails =await  Piece.findOne({id})

        res.json(pieceDetails)
    } catch (error) {
        console.log("Error", error)
        res.json({
            message: " Failed",
            success: false
        })
    }
})