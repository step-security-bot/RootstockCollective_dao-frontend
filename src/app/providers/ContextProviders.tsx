'use client'
import { config, configToUse, REOWN_PROJECT_ID, wagmiAdapter } from '@/config'
import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { AlertProvider } from './AlertProvider'
import ErrorBoundary from '@/components/ErrorPage/ErrorBoundary'
import { BuilderContextProviderWithPrices } from '../collective-rewards/user'
import { AllocationsContextProvider } from '../collective-rewards/allocations/context'
import { BoosterProvider } from './NFT/BoosterContext'
import { MainContainer } from '@/components/MainContainer/MainContainer'
import { BalancesProvider } from '@/app/user/Balances/context/BalancesContext'
import { HeroCollapseProvider } from '@/app/user/HeroSection/HeroCollapseContext'
import { rootstock, rootstockTestnet } from '@reown/appkit/networks'

interface Props {
  children: ReactNode
}

// Set up metadata
const metadata = {
  name: 'Test DAO',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: REOWN_PROJECT_ID,
  networks: [rootstock, rootstockTestnet],
  defaultNetwork: rootstockTestnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
})

export const ContextProviders = ({ children }: Props) => {
  const queryClient = new QueryClient()

  return (
    <ErrorBoundary>
      <WagmiProvider config={configToUse}>
        <QueryClientProvider client={queryClient}>
          <AlertProvider>
            <HeroCollapseProvider>
              <BuilderContextProviderWithPrices>
                <BoosterProvider>
                  <AllocationsContextProvider>
                    <BalancesProvider>
                      <MainContainer>{children}</MainContainer>
                    </BalancesProvider>
                  </AllocationsContextProvider>
                </BoosterProvider>
              </BuilderContextProviderWithPrices>
            </HeroCollapseProvider>
          </AlertProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
