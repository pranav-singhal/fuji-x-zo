'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createConfig, WagmiConfig } from 'wagmi'

const queryClient = new QueryClient()

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

const config = createConfig(
  getDefaultConfig({
    appName: "Fuji X Zo Gallery",
    walletConnectProjectId,
    chains: [mainnet],
    transports: {
      [mainnet.id]: http('https://eth.llamarpc.com')
    }
  })
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // @ts-ignore
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
