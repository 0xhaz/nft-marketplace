import '../styles/globals.css'
import Link from 'next/link'
import WalletInfo from './walletinfo'
import React, { useContext } from "react"
import ContextProvider from './context'

function Marketplace({ Component, pageProps }) {
  return (
    <ContextProvider>
    <div>
     
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-black">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-black">
              Sell NFTs
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-black">
              My NFTs
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-black">
              Creator Dashboard
            </a>
          </Link>
        </div>
        <div className="absolute top-0 right-0 p-5 m-2">
        <WalletInfo />
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
    </ContextProvider>
  )
}

export default Marketplace