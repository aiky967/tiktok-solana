import styles from '../styles/Home.module.css'
import MainView from '../components/MainView';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';




export default function Home() {

  const { connected } = useWallet()

  return (
    <div className="app">
      {connected ? (
        <MainView />
      ) : (
        <div className='loginContainer'>
          <div className='loginTitle'>
            Log in TikTok
          </div>
          <div className='loginSubtitle'>
            Manage your account, check notifications,
            comment on videos, more
          </div>
          <WalletMultiButton />
        </div>
      )}
    </div>
  )
}
