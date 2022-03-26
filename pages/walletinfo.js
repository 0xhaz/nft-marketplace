import React, { useContext } from "react";
import { DispatchContext, StateContext } from "./context";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { supportedNetworks , networkIdToNameMap } from "../config";

const WalletInfo = () => {
    const {  wallet, connectedWalletAddress, connectedNetwork } = useContext(StateContext)
    const dispatch = useContext(DispatchContext)
    const [signerData, setSignerData] = useState({ address: null, balance: null })
    const { address, balance } = signerData

    const connectWallet = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const jsonRpcProvider = new ethers.providers.getDefaultProvider('ropsten', {alchemy: process.env.ROPSTEN_URL,})

        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const network = await provider.getNetwork()
        console.log("network", network)

        dispatch({
            type: 'CONNECT_WALLET',
            payload: { provider, signer, jsonRpcProvider },
        })
        dispatch({
            type: 'SET_CONNECTED_WALLET',
            payload: {address, network},
        })
    }

    const disconnectWallet = () => {
        dispatch({ type: 'DISCONNECT_WALLET'})
    }

    // if (window.ethereum) {
    //     window.ethereum.on('accountsChanged', function(accounts) {
    //         console.log('accounts', accounts)
    //         if (accounts.length && wallet.provider) window.location.reload()
    //     })
    // }

    useEffect(() => {
        if (wallet.signer) {
            getSignerData(wallet.signer)
        }
        if (wallet.provider) getBlockData()

        if (!wallet.provider) setSignerData ({ address: null, balance: null})
    }, [wallet])

    const getSignerData = async (signer) => {
        const address = await signer.getAddress()
        let balance = await signer.getBalance()
        balance = ethers.utils.formatUnits(balance.toString(), 'ether')
        balance = parseFloat(balance).toFixed(5)
        return setSignerData({ address, balance})
    }

    const getBlockData = async () => {
        const blockData = await wallet.provider.getBlock()
        console.log("blockData", blockData)
    }

    console.log("connectedNetwork", connectedNetwork)

    return (
        <div className="text-xs flex flex-col m-auto">
            {address && (
                <div className="flexx flex-row">
                    <p className="pr-1">Connected:</p>
                    <p>{address.substring(0, 7)}</p>
                </div>
            )}
            {connectedNetwork && supportedNetworks.includes(connectedNetwork.chainId) && (
                <div className="flex flex-row">
                    <p className="pr-1">Network:</p>
                    <p>{connectedNetwork.name}</p>
                </div>
            )}
            {connectedNetwork && !supportedNetworks.includes(connectedNetwork.chainId) && (
                <>
                <div className="flex flex-row">
                    <p className="pr-1">Network</p>
                    <p>{connectedNetwork.name}</p>
                </div>
                    <p className="text-red-500">Unsupported network. Please connect to {supportedNetworks.map(chainId => networkIdToNameMap[chainId]).join(', ')}</p>
                </>
            )}
            {balance && (
                <div className="flex flex-row">
                    <p className="pr-1">Balance:</p>
                    <p>{balance.substring(0,10)}</p>
                </div>
            )}
            {!address ? (
                <button
                    className="bg-blue-500 text-white font-bold py-2 px-2 rounded"
                    onClick={connectWallet}>
                        Connect
                    </button>
            ) : (
                <button
                    className="bg-blue-500 text-white font-bole py-2 px-2 rounded"
                    onClick={disconnectWallet}>
                        Disconnect
                    </button>
            )}
        </div>
    )
}

export default WalletInfo