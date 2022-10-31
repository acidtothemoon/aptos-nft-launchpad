import React from 'react'
import Link from 'next/link';
import { motion } from "framer-motion"
import { useWallet } from '@manahippo/aptos-wallet-adapter';


interface Props {
    setConnectModalOn: Function
}

const Header = ({ setConnectModalOn }: Props) => {
    const {
        account,
        disconnect,
        connected,
        wallet: currentWallet,
    } = useWallet();


    return (
        <header className='flex items-center justify-between text-white pt-8 '>
            <Link href={'/'}>
                <div className='cursor-pointer md:text-5xl p-5'>
                    <h1 className=' text-2xl font-bold sm:w-400 text-white md:text-5xl' >
                        Acid Labs
                    </h1>
                    <p className='flex text-md text-lg font-semibold'>
                        Aptos NFT Launchpad
                    </p>
                </div>


            </Link>
            <div className='flex flex-col items-center'>
                <motion.div
                    whileTap={{
                        scale: 0.8,
                        rotate: 0,
                        borderRadius: "100%"
                    }}
                >
                    <button onClick={() => (connected ? disconnect() : setConnectModalOn(true))}
                        className='rounded-full bg-green-900 hover:bg-green-800 py-3 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>
                        {connected ? "Disconnect" : "Connect Wallet"}
                    </button>
                </motion.div>
                {connected ? (
                    <p className='text-right py-1 text-sm text-[#52dc82] font-semibold'>
                        {account?.address?.toString().substring(0, 5)}...{account?.address?.toString().substring(account.address?.toString().length - 5, account.address?.toString().length)}
                    </p>
                ) : null}
            </div>
        </header>
    )
}

export default Header
