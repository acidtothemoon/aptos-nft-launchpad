import React, { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {}

const Header = (props: Props) => {
    const [address, setAddress] = useState<String | null>(null)
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
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
            <header className='flex items-center justify-between'>
                <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
                    <span className='font-extrabold text-[#4a338e] underline decoration-pink-600/50'>
                        Only2
                    </span>
                    {' '} NFT Launchpad

                </h1>
                <motion.div
                    whileTap={{
                        scale: 0.8,
                        rotate: 0,
                        borderRadius: "100%"
                    }}
                >
                    <button onClick={() => (isWalletConnected ? disconnect() : connectWallet())}
                        className='rounded-full bg-blue-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>
                        {isWalletConnected ? "Disconnect" : "Connect"}
                    </button>
                </motion.div>
            </header>
        </div>
    )
}

export default Header