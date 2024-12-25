'use client'

import { ConnectKitButton } from "connectkit"
import { useEffect, useState } from "react"
import { useAccount, useReadContract } from "wagmi"

const NFT_CONTRACT_ADDRESS = "0xF9e631014Ce1759d9B76Ce074D496c3da633BA12"

// ERC721 ABI with more complete interface
const ERC721_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export default function Home() {
  const { address, isConnected } = useAccount()
  const [hasNFT, setHasNFT] = useState<boolean>(false)

  const { data: contractName } = useReadContract({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: ERC721_ABI,
    functionName: 'name',
    query: {
      enabled: isConnected
    }
  })

  const { data: balance, isLoading: isCheckingBalance, error } = useReadContract({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: ERC721_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address
    }
  })

  console.log("Contract interaction details:", {
    address: NFT_CONTRACT_ADDRESS,
    walletAddress: address,
    isConnected,
    contractName,
    balance,
    isCheckingBalance,
    error
  })

  useEffect(() => {
    if (balance && Number(balance) > 0) {
      setHasNFT(true)
    } else {
      setHasNFT(false)
    }
  }, [balance])

  if (!isConnected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Welcome to Fuji X Photo Gallery</h1>
          <p className="text-lg mb-8 text-zinc-300">Connect your wallet to view the exclusive photo collection</p>
          <ConnectKitButton />
        </div>
      </main>
    )
  }

  if (isCheckingBalance) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Checking NFT ownership...</h2>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </main>
    )
  }

  if (!hasNFT) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Access Required</h1>
          <p className="text-lg mb-4 text-zinc-300">You need to own an NFT from our collection to view the gallery</p>
          <p className="text-sm text-zinc-500 mb-8">Contract: {NFT_CONTRACT_ADDRESS}</p>
          <ConnectKitButton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Photo Gallery</h1>
          <ConnectKitButton />
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square bg-zinc-800 rounded-lg animate-pulse relative overflow-hidden group hover:ring-2 hover:ring-white/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
