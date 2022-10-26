import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';

type Props = {
    address?: string
    setAddress: Function
    isWalletConnected: Boolean
    setIsWalletConnected: Function
}

const Header = ({ address, setAddress, isWalletConnected, setIsWalletConnected }: Props) => {

    // Auth
    const connectWallet = async () => {
        if ("martian" in window) {
            console.log("connecting wallet")
            const response = await window.martian.connect();
            const address = response.address
            console.log(address);
            setAddress(address)
            const isConnected = await window.martian.isConnected()
            if (isConnected) {
                setIsWalletConnected(true)
            }
            console.log("wallet connected");
            // setConnenctButtonText('Connected');
            return;
        }
        window.open("https://www.martianwallet.xyz/", "_blank");
    };
    const disconnect = async () => {
        await window.martian.disconnect()
        setIsWalletConnected(false)
        setAddress(null)
    }
    return (
        <div>
            <header className='flex flex-1 items-center justify-between text-white pt-8 '>
                <Link href={'/'}>
                    <h1 className='w-52 cursor-pointer text-xl font-bold sm:w-80 text-transparent text-white md:text-5xl' >
                        <span className='font-extrabold '>
                            Aptos
                        </span>
                        {' '} NFT Launchpad
                    </h1>
                </Link>
                <motion.div
                    whileTap={{
                        scale: 0.8,
                        rotate: 0,
                        borderRadius: "100%"
                    }}
                >
                    <button onClick={() => (isWalletConnected ? disconnect() : connectWallet())}
                        className='rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>
                        {isWalletConnected ? "Disconnect" : "Connect"}
                    </button>
                </motion.div>
            </header>
        </div>
    )
}

export default Header