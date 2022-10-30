import React, { useEffect } from 'react'
import { motion } from "framer-motion"
import { Address, useWallet } from '@manahippo/aptos-wallet-adapter';
import { SocketAddress } from 'net';



interface Props {
    address?: Address | null
    disconnect: Function
    setConnectModalOn: Function
    setAddress: Function
}

const index = ({ setAddress, setConnectModalOn, address }: Props) => {
    const {
        account,
        wallets,
        wallet: currentWallet,
        connected,
        connect
    } = useWallet();



    const renderWalletConnectorGroup = () => {
        return wallets.map((wallet) => {
            const option = wallet.adapter;
            return (

                <motion.div
                    whileTap={{
                        scale: 0.8,
                        rotate: 0,
                        borderRadius: "100%"
                    }}
                >
                    <li>
                        <div className='flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white'>
                            <button
                                onClick={() => {
                                    connect(option.name)
                                    setConnectModalOn(false)
                                }}
                                id={option.name.split(' ').join('_')}
                                key={option.name}
                                // className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base">
                                className=''>
                                <div className='flex space-x-4'>
                                    <img
                                        className='h-8 w-8 rounded-full'
                                        src={option.icon}
                                    />
                                    <span className='flex-1 ml-3 whitespace-nowrap'>
                                        {option.name}
                                    </span>
                                    {option.name == ("Martian") || option.name == ("Petra") ? (
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Popular</span>
                                    ) : null}
                                </div>
                            </button>
                        </div>
                    </li>
                </motion.div>
            );
        });
    };

    return (
        // <div className='fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50'>
        //     <div className='flex flex-col items-center justify-center space-y-5'>
        <div className="bg-opacity-80 backdrop-blur-sm overflow-y-auto overflow-x-hidden fixed flex items-center justify-center z-50 w-full md:inset-0 h-modal md:h-full">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">

                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                    <button onClick={() => setConnectModalOn(false)}
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="crypto-modal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>

                    <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
                        <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                            Connect wallet
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Connect with one of our available wallet providers or create a new one.</p>
                        <ul className="my-4 space-y-3">
                            {renderWalletConnectorGroup()}
                            {/* <button
                                className='text-white bg-red-500 font-bold px-5 py-3 rounded-2xl'
                                onClick={() => setConnectModalOn(false)}>close</button> */}
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default index