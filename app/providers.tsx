'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { createConfig, WagmiConfig } from 'wagmi'

const queryClient = new QueryClient()

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

const config = createConfig(
  getDefaultConfig({
    appName: "Fuji X Photo Gallery",
    walletConnectProjectId,
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http('https://eth.llamarpc.com'),
      [sepolia.id]: http()
    }
  })
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
