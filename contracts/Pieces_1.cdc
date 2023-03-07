import MetadataViews from "./standard/MetadataViews.cdc"
import NonFungibleToken from "./standard/NonFungibleToken.cdc"
import FungibleToken from "./standard/FungibleToken.cdc"
import FlowToken from "./standard/FlowToken.cdc"


pub contract Pieces_1: NonFungibleToken {

	// Collection Information
	access(self) let collectionInfo: {String: AnyStruct}

	// Contract Information
	pub var nextEditionId: UInt64
	pub var totalSupply: UInt64

  // Events
  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)
	pub event Minted(id: UInt64, recipient: Address, metadataId: UInt64)
  pub event Purchase(id: UInt64, recipient: Address, metadataId: UInt64, name: String, description: String, image: MetadataViews.IPFSFile, price: UFix64)

	// Paths
	pub let CollectionStoragePath: StoragePath
	pub let CollectionPublicPath: PublicPath
	pub let CollectionPrivatePath: PrivatePath
	pub let AdministratorStoragePath: StoragePath

	// Maps metadataId of NFT to NFTMetadata
	access(account) let metadatas: {UInt64: NFTMetadata}

	// You can get a list of purchased NFTs
	// by doing `buyersList.keys`
	access(account) let buyersList: {Address: {UInt64: [UInt64]}}

	access(account) let nftStorage: @{Address: {UInt64: NFT}}

	pub struct NFTMetadata {
		pub let twitterId: UInt64
		pub let description: String
		pub let image: MetadataViews.IPFSFile
		pub var minted: UInt64
		pub let purchasers: {UInt64: Address}
		pub let metadataId: UInt64

		access(account) fun purchased(serial: UInt64, buyer: Address) {
			self.purchasers[serial] = buyer
		}

		access(account) fun updateMinted() {
			self.minted = self.minted + 1
		}

		init(_twitterId: UInt64, _description: String, _image: MetadataViews.IPFSFile) {
			self.metadataId = _twitterId
			self.twitterId = _twitterId
			self.description = _description
			self.image = _image
			self.minted = 0
			self.purchasers = {}
		}
	}

	pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
		pub let id: UInt64
		// The 'metadataId' is what maps this NFT to its 'NFTMetadata'
		pub let metadataId: UInt64
		pub let serial: UInt64

		pub fun getMetadata(): NFTMetadata {
			return Pieces_1.getNFTMetadata(self.metadataId)!
		}

		pub fun getViews(): [Type] {
			return [
				Type<MetadataViews.Display>(),
				Type<MetadataViews.ExternalURL>(),
				Type<MetadataViews.NFTCollectionData>(),
				Type<MetadataViews.NFTCollectionDisplay>(),
				Type<MetadataViews.Royalties>(),
				Type<MetadataViews.Serial>(),
				Type<MetadataViews.NFTView>()
			]
		}

		pub fun resolveView(_ view: Type): AnyStruct? {
			switch view {
				case Type<MetadataViews.Display>():
					let metadata = self.getMetadata()
					return MetadataViews.Display(
						twitterId: metadata.twitterId.toString(),
						description: metadata.description,
						thumbnail: metadata.image
					)
				case Type<MetadataViews.NFTCollectionData>():
					return MetadataViews.NFTCollectionData(
						storagePath: Pieces_1.CollectionStoragePath,
						publicPath: Pieces_1.CollectionPublicPath,
						providerPath: Pieces_1.CollectionPrivatePath,
						publicCollection: Type<&Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(),
						publicLinkedType: Type<&Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(),
						providerLinkedType: Type<&Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection, NonFungibleToken.Provider}>(),
						createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
								return <- Pieces_1.createEmptyCollection()
						})
					)
        case Type<MetadataViews.ExternalURL>():
          return MetadataViews.ExternalURL("https://hackathon.flow.com/")
        case Type<MetadataViews.NFTCollectionDisplay>():
          let squareMedia = MetadataViews.Media(
            file: Pieces_1.getCollectionAttribute(key: "image") as! MetadataViews.IPFSFile,
            mediaType: "image"
          )

					var bannerMedia: MetadataViews.Media? = nil
					let bannerImage = Pieces_1.getCollectionAttribute(key: "bannerImage") as! MetadataViews.IPFSFile
						bannerMedia = MetadataViews.Media(
							file: bannerImage,
							mediaType: "image"
					)

        return MetadataViews.NFTCollectionDisplay(
          name: Pieces_1.getCollectionAttribute(key: "name") as! String,
          description: Pieces_1.getCollectionAttribute(key: "description") as! String,
          externalURL: MetadataViews.ExternalURL("https://hackathon.flow.com/"),
          squareImage: squareMedia,
          bannerImage: bannerMedia ?? squareMedia,
          socials: Pieces_1.getCollectionAttribute(key: "socials") as! {String: MetadataViews.ExternalURL}
        )
        case Type<MetadataViews.Royalties>():
          return MetadataViews.Royalties([
            MetadataViews.Royalty( // This is my own Blotco address
              recepient: getAccount(0x61449dd762defed0).getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver),
              cut: 0.07, // 7% royalty on secondary sales
              description: "Whatever account we set will receive this amount of royalty on secundary sales"
            )
          ])
				case Type<MetadataViews.Serial>():
					return MetadataViews.Serial(
						self.serial
					)
				case Type<MetadataViews.NFTView>():
					return MetadataViews.NFTView(
						id: self.id,
						uuid: self.uuid,
						display: self.resolveView(Type<MetadataViews.Display>()) as! MetadataViews.Display?,
						externalURL: self.resolveView(Type<MetadataViews.ExternalURL>()) as! MetadataViews.ExternalURL?,
						collectionData: self.resolveView(Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?,
						collectionDisplay: self.resolveView(Type<MetadataViews.NFTCollectionDisplay>()) as! MetadataViews.NFTCollectionDisplay?,
						royalties: self.resolveView(Type<MetadataViews.Royalties>()) as! MetadataViews.Royalties?,
						traits: self.resolveView(Type<MetadataViews.Traits>()) as! MetadataViews.Traits?
					)
			}
			return nil
		}

		init(_metadataId: UInt64, _recipient: Address) {
			pre {
				Pieces_1.metadatas[_metadataId] != nil:
					"This NFT does not exist in this collection."
			}
			let _serial = Pieces_1.getNFTMetadata(_metadataId)!.minted
			self.id = self.uuid
			self.metadataId = _metadataId
			self.serial = _serial

			// Update the buyers list so we keep track of who is purchasing
			if let buyersRef = &Pieces_1.buyersList[_recipient] as &{UInt64: [UInt64]}? {
				if let metadataIdMap = &buyersRef[_metadataId] as &[UInt64]? {
					metadataIdMap.append(_serial)
				} else {
					buyersRef[_metadataId] = [_serial]
				}
			} else {
				Pieces_1.buyersList[_recipient] = {_metadataId: [_serial]}
			}

			let metadataRef = (&Pieces_1.metadatas[_metadataId] as &NFTMetadata?)!
			// Update who bought this serial inside NFTMetadata
			metadataRef.purchased(serial: _serial, buyer: _recipient)
			// Update the total supply of this MetadataId by 1
			metadataRef.updateMinted()
			// Update Pieces_1 collection NFTs count
			Pieces_1.totalSupply = Pieces_1.totalSupply + 1

			emit Minted(id: self.id, recipient: _recipient, metadataId: _metadataId)
		}
	}

	pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
		pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

		// Withdraw removes an NFT from the collection and moves it to the caller(for Trading)
		pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
			let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

			emit Withdraw(id: token.id, from: self.owner?.address)

			return <-token
		}

		// Deposit takes a NFT and adds it to the collections dictionary
		// and adds the ID to the id array
		pub fun deposit(token: @NonFungibleToken.NFT) {
			let token <- token as! @NFT

			let id: UInt64 = token.id

			// Add the new token to the dictionary
			self.ownedNFTs[id] <-! token

			emit Deposit(id: id, to: self.owner?.address)
		}

		// GetIDs returns an array of the IDs that are in the collection
		pub fun getIDs(): [UInt64] {
			return self.ownedNFTs.keys
		}

		// BorrowNFT gets a reference to an NFT in the collection
		pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
			return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
		}

		pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
			let token = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
			let nft = token as! &NFT
			return nft
		}

		pub fun claim() {
			if let storage = &Pieces_1.nftStorage[self.owner!.address] as &{UInt64: NFT}? {
				for id in storage.keys {
					self.deposit(token: <- storage.remove(key: id)!)
				}
			}
		}

		init () {
			self.ownedNFTs <- {}
		}

		destroy() {
			destroy self.ownedNFTs
		}
	}

	pub resource Administrator {
		pub fun createNFTMetadata(twitterId: UInt64, description: String, imagePath: String, ipfsCID: String) {
			Pieces_1.metadatas[twitterId] = NFTMetadata(
				_twitterId: twitterId,
				_description: description,
				_image: MetadataViews.IPFSFile(
					cid: ipfsCID,
					path: imagePath
				)
			)
		}

		// mintNFT mints a new NFT and deposits
		// it in the recipients collection
		pub fun mintNFT(metadataId: UInt64, recipient: Address) {

			let nft <- create NFT(_metadataId: metadataId, _recipient: recipient)
			if let recipientCollection = getAccount(recipient).getCapability(Pieces_1.CollectionPublicPath).borrow<&Pieces_1.Collection{NonFungibleToken.CollectionPublic}>() {
				recipientCollection.deposit(token: <- nft)
			} else {
				if let storage = &Pieces_1.nftStorage[recipient] as &{UInt64: NFT}? {
					storage[nft.id] <-! nft
				} else {
					Pieces_1.nftStorage[recipient] <-! {nft.id: <- nft}
				}
			}
		}

		// create a new Administrator resource
		pub fun createAdmin(): @Administrator {
			return <- create Administrator()
		}

		// change pieces_1 of collection info
		pub fun changeField(key: String, value: AnyStruct) {
			Pieces_1.collectionInfo[key] = value
		}
	}

	// public function that anyone can call to create a new empty collection
	pub fun createEmptyCollection(): @NonFungibleToken.Collection {
		return <- create Collection()
	}

	// Get information about a NFTMetadata
	pub fun getNFTMetadata(_ metadataId: UInt64): NFTMetadata? {
		return self.metadatas[metadataId]
	}

	pub fun getNFTMetadatas(): {UInt64: NFTMetadata} {
		return self.metadatas
	}

	pub fun getbuyersList(): {Address: {UInt64: [UInt64]}} {
		return self.buyersList
	}

	pub fun getCollectionInfo(): {String: AnyStruct} {
		let collectionInfo = self.collectionInfo
		collectionInfo["metadatas"] = self.metadatas
		collectionInfo["buyersList"] = self.buyersList
		collectionInfo["totalSupply"] = self.totalSupply
		collectionInfo["version"] = 1
		return collectionInfo
	}

	pub fun getCollectionAttribute(key: String): AnyStruct {
		return self.collectionInfo[key] ?? panic(key.concat(" is not an attribute in this collection."))
	}

	init() {
		// Collection Info
		self.collectionInfo = {}
		self.collectionInfo["name"] = "Pieces_1"
		self.collectionInfo["description"] = "Inmortalize Everything!"
		self.collectionInfo["image"] = MetadataViews.IPFSFile(
				cid: "ipfs://bafybeihkurbbjxq5v7ag62ahvatrvizmv4tqebzzm26nz6ils4nxgh5ko4",
				path: "/Alex1.png"
		)
		self.collectionInfo["bannerImage"] = MetadataViews.IPFSFile(
				cid: "ipfs://bafybeihkurbbjxq5v7ag62ahvatrvizmv4tqebzzm26nz6ils4nxgh5ko4",
				path: "/Alex1.png"
		)
    self.collectionInfo["ipfsCID"] = "ipfs://bafybeihkurbbjxq5v7ag62ahvatrvizmv4tqebzzm26nz6ils4nxgh5ko4"
    self.collectionInfo["dateCreated"] = getCurrentBlock().timestamp
    self.collectionInfo["profit"] = 0.0
		self.collectionInfo["nftRoyalty"] =  MetadataViews.Royalty(
          recepient: getAccount(self.account.address).getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver),
          cut: 0.7,
          description: "This is a royalty cut on primary sales."
        )


		self.nextEditionId = 0
		self.totalSupply = 0
		self.metadatas = {}
		self.buyersList = {}
		self.nftStorage <- {}

		// Set the named paths
		self.CollectionStoragePath = /storage/Pieces_1Collection
		self.CollectionPublicPath = /public/Pieces_1Collection
		self.CollectionPrivatePath = /private/Pieces_1Collection
		self.AdministratorStoragePath = /storage/Pieces_1Administrator

		// Create a Collection resource and save it to storage
		let collection <- create Collection()
		self.account.save(<- collection, to: self.CollectionStoragePath)

		// Create a public capability for the collection
		self.account.link<&Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(
			self.CollectionPublicPath,
			target: self.CollectionStoragePath
		)

		// Create a Administrator resource and save it to storage
		let administrator <- create Administrator()
		self.account.save(<- administrator, to: self.AdministratorStoragePath)

		emit ContractInitialized()
	}
}
