import React, { useState } from 'react'
import { motion } from "framer-motion"

type Props = {}

const NFTDropPage = (props: Props) => {
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
        <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
            {/* Left */}
            <div className='lg:col-span-4 bg-gradient-to-br from-blue-900 to-black'>
                <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
                    <div className='bg-gradient-to-br from-red-400 to-purple-600 p-2 rounded-xl'>
                        <img
                            className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                            src="https://links.papareact.com/8sg" />

                    </div>
                    <div className='text-center p-5 space-y-2'>
                        <h1 className='text-4xl font-bold text-white'>Ape</h1>
                        <h2 className='text-xl text-gray-300'>Introduction</h2>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
                {/* Header */}
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

                <hr className='my-2 border' />
                {address && (
                    <p className='text-right text-sm text-white-400'>
                        You're logged in with {address.substring(0, 5)}...{address.substring(address.length - 5, address.length)}
                    </p>
                )}

                {/* Content */}
                <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0'>
                    <img className='w-80 object-cover pb-10 lg:h-40'
                        src='https://links.papareact.com/bdy'
                    />
                    <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
                        Bored Ape Elon | NFT Drop
                    </h1>
                    <p className='pt-2 text-xl text-green-500'>13/21 Claimed</p>
                </div>

                {/* Mint Button */}
                <button className='h-16 bg-blue-800 w-full text-white rounded-full mt-10 font-bold'>
                    Mint For 2.5 APT
                </button>
            </div>

        </div>
    )
}

export default NFTDropPage