import { Piece } from "../models/pieceModel";

export const savePieceListingData = async (
    id: String,
    amount: String,
    authorUserName: String,
    createdAt: String,
    pieceText: String,
) => {
    const newPiece = await new Piece({ 
        id: id,
        amount: amount, 
        authorUserName: authorUserName,
        isCollected:false,
        createdAt:createdAt,
        pieceText:pieceText
    }).save();

    return newPiece.id;

};
