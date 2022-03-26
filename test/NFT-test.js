const { expect } = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMarketplace", function () {
    let NFT;
    let nft;
    let Marketplace;
    let marketplace;
    let deployer;
    let addr1;
    let addr2;
    let addr3;
    let ownerAddress = "0x0000000000000000000000000000000000000000" // dummmy address
    let fee = toWei(0.025);
    let URI = "sample URI"

    beforeEach(async function () {
        NFT = await ethers.getContractFactory("NFT");
        Marketplace = await ethers.getContractFactory("NFTMarket");
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
        
        marketplace = await Marketplace.deploy();
        nft = await NFT.deploy(marketplace.address);

        let listingFee = await marketplace.getListingPrice()
        listingFee = listingFee.toString()

    });

    describe("Deployment", function () {

        it("Should track name and symbol of the nft collection", async function () {
            const nftName = "Chainshot"
            const nftSymbol = "CST"
            expect(await nft.name()).to.equal(nftName);
            expect(await nft.symbol()).to.equal(nftSymbol);
        })

    })



    describe("Minting NFTs", function () {

        it("Should track each minted NFT", async function () {
            // addr1 mints an nft
            await nft.connect(addr1).createToken(URI)
            expect(await nft._tokenIds()).to.equal(1) // change to public
            expect(await nft.balanceOf(addr1.address)).to.equal(1)
            expect(await nft.tokenURI(1)).to.equal(URI)
            // addr2 mints an nft
            await nft.connect(addr2).createToken(URI)
            expect(await nft._tokenIds()).to.equal(2)
            expect(await nft.balanceOf(addr2.address)).to.equal(1)
            expect(await nft.tokenURI(2)).to.equal(URI)
        })
    })

    describe("Making marketplace items", function () {
        let price = 1
        let result               
        
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).createToken(URI)
            // addr1 approves marketpalce to spend NFT
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
        })

        it("Should track newly created item, transfer NFT from seller to marketplace and emit MarketItemCreated", async function () {
            let listingFee = await marketplace.getListingPrice()
            listingFee = listingFee.toString()
            
            
            // addr1 offers their nft at a price of 1 ether
            await expect(marketplace.connect(addr1).createMarketItem(nft.address, 1, toWei(price)))
            .to.emit(marketplace, "MarketItemCreated")
            .withArgs(
                1,
                nft.address,
                1,
                addr1.address,
                ownerAddress,
                toWei(price),
                false,
                true
            )
            // Owner of NFT should now be the marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address)
            // Item id should now equal 1
            expect(await marketplace._itemIds()).to.equal(1) // change to public
            // Get item from items mapping then check fields to ensure they are correct
            const item = await marketplace.idToMarketItem(1)
            expect(item.itemId).to.equal(1)
            expect(item.nftContract).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.seller).to.equal(addr1.address)
            expect(item.owner).to.equal(ownerAddress)
            expect(item.sold).to.equal(false)
            expect(item.listed).to.equal(true)
        });

        it("Should fail if price is set to zero", async function () {
            await expect(
                marketplace.connect(addr1).createMarketItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price must be at least 1 wei")
        });
    });

    describe("Purchasing marketplace items", function () {
        let price = toWei(2)
        let totalPriceInWei
       
        beforeEach(async function () {
            let listingFee = await marketplace.getListingPrice()
            listing = listingFee.toString()
            const askingPrice = toWei(2)
            // addr1 mints an nft
            await nft.connect(addr1).createToken(URI)
            // addr1 approves marketplace to spend tokens
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
            // addr1 makes their nft a marketplace item
            await marketplace.connect(addr1).createMarketItem(nft.address, 1, askingPrice, {value: listingFee})
        })

        it("Should update item as sold, pay seller and transfer NFT to buyer", async function () {           
            // fetch items total price (market fees + item price)
            let listingFee = await marketplace.getListingPrice()
            listingFee = fromWei(listingFee)
            let askingPrice = toWei(2)
            // addr 2 purchases item
            await marketplace.connect(addr2).createMarketSale(nft.address, 1, {value: askingPrice})
            // Item should be marked as sold
            const item = await marketplace.idToMarketItem(1)
            
            // Seller should receive payment for the price of the NFT sold
            // expect(+fromWei(sellerFinalEthBal)).to.equal(+askingPrice + +fromWei(sellerInitialEthBal))
            // feeAccount should receive fee
            // expect(+fromWei(feeAccountFinalEthBal)).to.equal(+listingFee + +fromWei(feeAccountInitialEthBal))
            // // The buyer should now own the nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
        })

        it("Should fail when not enough ether is paid", async function () {
            // fails for below asking price
            askingPrice = toWei(1)
            await expect(
                marketplace.connect(addr2).createMarketSale(nft.address, 1, {value: askingPrice})
            ).to.be.revertedWith("Please submit the asking price in order to complete the purchase");
        })
    })

})