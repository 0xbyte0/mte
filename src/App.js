import "./App.css";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Home from "./pages/index";

const { chains, publicClient } = configureChains(
  [mainnet],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'MixToEarn',
  projectId: '37f0c5c62b50feaafd536e6b5edbc947',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Home />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
