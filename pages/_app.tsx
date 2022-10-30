import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  HippoExtensionWalletAdapter,
  MartianWalletAdapter,
  AptosWalletAdapter,
  FewchaWalletAdapter,
  WalletProvider,
  PontemWalletAdapter,
  SpikaWalletAdapter,
  FletchWalletAdapter,
  AptosSnapAdapter,
  BitkeepWalletAdapter,
  TokenPocketWalletAdapter,
  WalletAdapterNetwork,
} from '@manahippo/aptos-wallet-adapter';
import { useMemo } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const wallets = useMemo(
    () => [
      // new HippoWalletAdapter(),
      new HippoExtensionWalletAdapter(),
      new MartianWalletAdapter(),
      new AptosWalletAdapter(),
      new FewchaWalletAdapter(),
      new PontemWalletAdapter(),
      new SpikaWalletAdapter(),
      new FletchWalletAdapter(),
      new AptosSnapAdapter(),
      new BitkeepWalletAdapter(),
      new TokenPocketWalletAdapter(),
    ],
    []
  );

  return (
    <WalletProvider
      wallets={wallets}
      onError={(error: Error) => {
        console.log('wallet errors: ', error);
      }}>
      <Component {...pageProps} />
    </WalletProvider>
  )
}

export default MyApp