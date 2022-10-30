import React from 'react'
import { motion } from "framer-motion"



interface Props {
    isConnectedWithMartian: boolean
    isConnectedWithPontem: boolean
    isConnectedWithPetra: boolean
    address?: string | null
    disconnect: Function
    connectWalletWithMartian: Function
    connectWalletWithPontem: Function
    connectWalletWithPetra: Function
    setConnectModalOn: Function
}

const index = ({ setConnectModalOn, isConnectedWithPetra, isConnectedWithPontem, isConnectedWithMartian, address, disconnect, connectWalletWithPontem, connectWalletWithPetra, connectWalletWithMartian }: Props) => {
    return (
        <div className='fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50'>
            <div className='flex flex-col items-center justify-center space-y-5'>
                <motion.div
                    whileTap={{
                        scale: 0.8,
                        rotate: 0,
                        borderRadius: "100%"
                    }}
                >
                    {(isConnectedWithPetra || isConnectedWithPontem) ? null :
                        (<button onClick={() => (isConnectedWithMartian ? disconnect() : connectWalletWithMartian())}
                            className='rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>
                            {isConnectedWithMartian ? "Disconnect" : "Connect with Martian"}
                        </button>)}
                </motion.div>
                <motion.div
                    whileTap={{
                        scale: 0.8,
                        rotate: 0,
                        borderRadius: "100%"
                    }}
                >
                    {(isConnectedWithMartian || isConnectedWithPontem) ? null :
                        (<button onClick={() => (isConnectedWithPetra ? disconnect() : connectWalletWithPetra())}
                            className='rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>
                            {isConnectedWithPetra ? "Disconnect" : "Connect with Petra"}
                        </button>)}
                </motion.div>
                <motion.div
                    whileTap={{
                        scale: 0.8,
                        rotate: 0,
                        borderRadius: "100%"
                    }}
                >
                    {(isConnectedWithMartian || isConnectedWithPetra) ? null : (<button onClick={() => (isConnectedWithPontem ? disconnect() : connectWalletWithPontem())}
                        className='rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>
                        {isConnectedWithPontem ? "Disconnect" : "Connect with Pontem"}
                    </button>)}
                </motion.div>
                <button
                    className='text-white bg-green-500 font-bold px-5 py-3 rounded-2xl'
                    onClick={() => setConnectModalOn(false)}>close</button>
            </div>
        </div>
    )
}

export default index