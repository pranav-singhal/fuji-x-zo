'use client'

import { PhotoGallery } from "@/components/PhotoGallery"
import { getPhotos } from "@/utils/supabase"
import { ConnectKitButton } from "connectkit"
import { useEffect, useState } from "react"
import { useAccount, useReadContract } from "wagmi"

const NFT_CONTRACT_ADDRESS = "0xF9e631014Ce1759d9B76Ce074D496c3da633BA12"
const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS

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

interface Photo {
  name: string
  url: string
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const [hasNFT, setHasNFT] = useState<boolean>(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false)

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
    } else if (address && ADMIN_ADDRESS && address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
      setHasNFT(true)
    } else {
      setHasNFT(false)
    }
  }, [balance, address])

  useEffect(() => {
    async function loadPhotos() {
      if (hasNFT) {
        setIsLoadingPhotos(true)
        try {
          const photosList = await getPhotos()
          console.log({ photosList })
          setPhotos(photosList)
        } catch (error) {
          console.error('Error loading photos:', error)
        } finally {
          setIsLoadingPhotos(false)
        }
      }
    }

    loadPhotos()
  }, [hasNFT])

  if (!isConnected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Welcome to Fuji X Zo</h1>
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
          <p className="text-lg mb-4 text-zinc-300">You need to be a zo house funder to view the gallery</p>
          <ConnectKitButton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Fuji X Zo Gallery</h1>
          <ConnectKitButton />
        </div>

        <PhotoGallery photos={photos} isLoading={isLoadingPhotos} />
      </div>
    </main>
  )
}
