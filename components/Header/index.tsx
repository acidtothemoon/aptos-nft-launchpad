import React from 'react'
import Link from 'next/link';
import { motion } from "framer-motion"


interface Props {
    isWalletConnected: boolean
    address?: string | null
    disconnect: Function
    connectWallet: Function
}

const Header = ({ isWalletConnected, address, disconnect, connectWallet }: Props) => {
    return (
        <header className='flex items-center justify-between text-white pt-8 '>
            <Link href={'/'}>
                <div className='cursor-pointer md:text-5xl p-5'>
                    <h1 className=' text-2xl font-bold sm:w-400 text-white md:text-5xl' >
                        Acid Labs
                    </h1>
                    <p className='flex text-md text-lg'>
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
                    <button onClick={() => (isWalletConnected ? disconnect() : connectWallet())}
                        className='rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>
                        {connectWallet ? "Disconnect" : "Connect"}
                    </button>
                    {/* {connected ? (
                        <button
                            onClick={connect(walletName)}>Connect</button>)
                        : (<button
                            onClick={disconnect(walletName)}>Disconnect</button>)
                    } */}

                </motion.div>
                {address ? (
                    <p className='text-right py-1 text-sm text-[#52dc82] font-semibold'>
                        {address.substring(0, 5)}...{address.substring(address.length - 5, address.length)}
                    </p>
                ) : null}
            </div>
        </header>
    )
}

export default Header
