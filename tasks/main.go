package main

import (
	"fmt"
	//if you imports this with .  you do not have to repeat overflow everywhere
	. "github.com/bjartek/overflow"
	"github.com/fatih/color"
)

func main() {

	//start an in memory emulator by default
	o := Overflow(
		WithGlobalPrintOptions(),
	)

	fmt.Println("Testing Contract")
	fmt.Println("Press any key to continue")
	fmt.Scanln()

	// Record Metadata to the contract
	color.Red("Should be able to upload metadata to the contract the Collection")
	o.Tx(
		"uploadMetadata",
		WithSigner("account"),
		WithArg("name", `"First Piece"`),
		WithArg("description", `"I bet that Argentina will win the 2022 World Cup"`),
		WithArg("image", `"Alex1.png"`),
		WithArg("extra", `{"String": "Piece Extra Metadata If needed"}`),
		WithArg("ipfsCID", "ipfs://bafybeihkurbbjxq5v7ag62ahvatrvizmv4tqebzzm26nz6ils4nxgh5ko4"),
	)
	color.Green("-----------------------------PASSED---------------------")

	// Get Metadatas recorded in the contract
	color.Red("Should be able to fetch metadatas from the contract")
	o.Script("getNFTsMetadatas")
	color.Green("-----------------------------PASSED---------------------")

	// Setup Bob's account to hold a Pieces NFT
	color.Red("Should be able to setup Bob's account with Pieces collection path")
	o.Tx("setupAccount",
		WithSigner("bob"),
	)
	color.Green("-----------------------------PASSED---------------------")

	// Bob mints an NFT
	color.Red("Bob should be able to mint an NFT")
	o.Tx("mintNFT",
		WithSigner("bob"),
		WithArg("metadataId", "0"),
	)
	color.Green("-----------------------------PASSED---------------------")

	// Get Metadatas recorded in the contract after minting
	// (supply should increase)
	color.Red("Should be able to fetch metadatas from the contract")
	o.Script("getNFTSupply",
		WithArg("MetadataId", "0"),
	)
	color.Green("-----------------------------PASSED---------------------")
}
