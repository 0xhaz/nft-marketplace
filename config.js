export const nftaddress = "0xf963c8ed3e4ad9ed87dfe3c97022f29618690387"
export const nftmarketaddress = "0x72c7c0c2a3dacdc1fcbe2f3fabc2450b10cc8c85"

import nftabi from "./artifacts/contracts/NFT.sol/NFT.json"
import nftMarketabi from "./artifacts/contracts/NFTMarket.sol/NFTMarket.json"

export const nftABI = nftabi.abi;
export const nftMarketABI = nftMarketabi.abi;

export const supportedNetworks = [3]
export const networkIdToNameMap = {
    3: 'ropsten'
}
