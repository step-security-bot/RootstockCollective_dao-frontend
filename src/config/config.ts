import { ENV } from '@/lib/constants'
import { defineChain, HttpTransportConfig } from 'viem'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { rootstock, rootstockTestnet } from '@reown/appkit/networks'
import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { injected } from 'wagmi/connectors'

export const REOWN_PROJECT_ID = '311defec7be42a57deaac94ce2d2ee0c'

const rskRegtest = defineChain({
  id: 33,
  name: 'RSK Regtest',
  nativeCurrency: { name: 'tRBTC', symbol: 'tRBTC', decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.REGTEST_URL || 'http://localhost:4444'],
    },
  },
})

const httpTransportConfig: HttpTransportConfig = {
  batch: {
    // this is the default value configured in RSKj
    batchSize: 100,
  },
}

export const config = createConfig({
  chains: [rskRegtest, rootstockTestnet, rootstock],
  transports: {
    [rootstock.id]: http(undefined, {
      ...httpTransportConfig,
    }),
    [rootstockTestnet.id]: http(undefined, {
      ...httpTransportConfig,
    }),
    [rskRegtest.id]: http(),
  },
  connectors: [injected()],
})

export const supportedChainId = {
  mainnet: rootstock.id,
  testnet: rootstockTestnet.id,
  regtest: rskRegtest.id,
}[ENV]!

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: REOWN_PROJECT_ID,
  networks: [rootstock, rootstockTestnet],
  transports: {
    [rootstock.id]: http(undefined, {
      ...httpTransportConfig,
    }),
    [rootstockTestnet.id]: http(undefined, {
      ...httpTransportConfig,
    }),
    [rskRegtest.id]: http(),
  },
})

export const configToUse = wagmiAdapter.wagmiConfig
