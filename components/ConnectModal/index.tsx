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
                    <button
                        onClick={() => {
                            connect(option.name)
                            setConnectModalOn(false)
                        }}
                        id={option.name.split(' ').join('_')}
                        key={option.name}
                        className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base">
                        {option.name}
                    </button>
                </motion.div>
            );
        });
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50'>
            <div className='flex flex-col items-center justify-center space-y-5'>
                <h3 className='text-white font-semibold text-lg'>Select a wallet</h3>
                {renderWalletConnectorGroup()}
                <button
                    className='text-white bg-red-500 font-bold px-5 py-3 rounded-2xl'
                    onClick={() => setConnectModalOn(false)}>close</button>
            </div>
        </div>
    )
}

export default index