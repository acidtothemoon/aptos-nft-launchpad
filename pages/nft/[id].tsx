import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Cursor, useTypewriter } from "react-simple-typewriter"
import { Collection } from '../../typings'
import Link from 'next/link'
import { AptosClient, TokenClient } from "aptos"
import toast, { Toaster } from 'react-hot-toast'


type Props = {
    collection: Collection
}

const NFTDropPage = (collection: Props) => {
    const [address, setAddress] = useState<String | null>(null)
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
    const [mintedAmount, setMintedAmount] = useState<number>(0)
    const [totalSupply, setTotalSupply] = useState<number>(0)
    const [amountLoading, setAmountLoading] = useState<boolean>(true)
    const [minted, setMinted] = useState<boolean>(false)
    const [minting, setMinting] = useState<boolean>(false)
    const [amountToMint, setAmountToMint] = useState<number>(1)
    const [maxMintPerWallet, setMaxMintPerWallet] = useState<number>(1)
    const [thisUserMinted, setThisUserMinted] = useState<number>(0)

    const [text, count] = useTypewriter({
        words: [
            `${collection.collection.title}`,
        ],
        // loop: true,
        delaySpeed: 2000,
    })

    useEffect(() => {
        connectWallet()
        setMaxMintPerWallet(collection.collection.maxMintPerWallet)
    }, [address])

    // useEffect(() => {
    //     const fetchNFTDropData = async () => {
    //         setAmountLoading(true)
    //         const client = new AptosClient("https://fullnode.mainnet.aptoslabs.com/v1");
    //         const tokenClient = new TokenClient(client);
    //         const creator = ""
    //         const collectionName = ""
    //         const data = await tokenClient.getCollectionData(creator, collectionName)
    //         const { description, maximum, name, supply, uri } = data

    //         setMintedAmount(supply)
    //         setTotalSupply(maximum)
    //         setAmountLoading(false)
    //     }

    //     fetchNFTDropData()
    // }, [])

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
            return;
        }
        window.open("https://www.martianwallet.xyz/", "_blank");
    };
    const disconnect = async () => {
        await window.martian.disconnect()
        setIsWalletConnected(false)
        setAddress(null)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAmountToMint(e.target.valueAsNumber)
    };

    const handleMint = async () => {
        console.log(address);
        // Auth
        if (amountToMint + thisUserMinted > maxMintPerWallet) {
            toast.error(`You can only mint ${maxMintPerWallet - thisUserMinted} more!`)
            setAmountToMint(maxMintPerWallet - thisUserMinted)
        }

        // Generate a transaction
        const payload = {
            // type: "entry_function_payload",
            function: "0x5ac985f1fe40c5121eb33699952ce8a79b1d1cb7438709dbd1da8e840a04fbee::candy_machine_v2::mint_tokens",
            type_arguments: [],
            arguments: [
                // cmAddress,
                // collectionName,
                `${collection.collection.address}`,
                `${collection.collection.nftCollectionName}`,
                { amountToMint },
            ]
        };
        const transaction = await window.martian.generateTransaction(address, payload);
        const txnHash = await window.martian.signAndSubmitTransaction(transaction);
        console.log(txnHash);
    }


    return (
        <div className='flex h-screen flex-col lg:grid lg:grid-cols-10 overflow-y-scroll'>
            <Toaster position='bottom-center' />
            {/* Left */}
            <div className='lg:col-span-4 bg-black pr-5 pl-5'>
                {/* Header */}
                <header className='flex flex-1 items-center justify-between text-white pt-8 '>
                    <Link href={'/'}>
                        <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80 text-transparent bg-clip-text bg-gradient-to-r from-[#236938] to-[#05e061] md:text-5xl' >
                            <span className='font-extrabold underline decoration-blue-600'>
                                Only2
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
                            className='rounded-full bg-blue-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>
                            {isWalletConnected ? "Disconnect" : "Connect"}
                        </button>
                    </motion.div>
                </header>
                {address && (
                    <p className='text-right text-sm text-[#52dc82] py-2 font-semibold'>
                        You're logged in with {address.substring(0, 5)}...{address.substring(address.length - 5, address.length)}
                    </p>
                )}
                {/* <hr className='my-1 border' /> */}

                <div className='flex flex-col items-center justify-center py-10 lg:min-h-screen'>
                    <div className='bg-gradient-to-br from-blue-400 to-purple-600 p-1 md:p-2 rounded-xl'>
                        <img
                            className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                            src={urlFor(collection.collection.previewImage).url()} />

                    </div>
                    <div className='text-center p-5 space-y-2'>
                        <h1 className='text-4xl font-bold text-white'>{collection.collection.nftCollectionName}</h1>
                        <h2 className='text-xl text-gray-300'>{collection.collection.description}</h2>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className='flex flex-1 flex-col p-12 lg:col-span-6 bg-gradient-to-r from-green-700 to-green-900'>
                {/* Content */}
                <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0'>
                    <img className='w-80 object-cover pb-8 lg:h-100'
                        src={urlFor(collection.collection.mainImage).url()}
                    />
                    <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
                        {text}
                    </h1>
                    {/* <p className='pt-2 text-xl text-green-500'>13/21 Claimed</p> */}
                    <h2 className="animate-pulse text-sm uppercase text-white pb-2 tracking-[5px] md:tracking-[5px] py-5">
                        {amountLoading ? (
                            <div className='justify-center items-center'>
                                <h1>&nbsp;Loading supply count...</h1>
                                {/* <div className='flex justify-center'>
                                    <img
                                        className='h-40 w-40 object-contain'
                                        src='https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif'
                                    />
                                </div> */}
                            </div>

                        ) : (
                            <div>&nbsp; {mintedAmount}/{totalSupply}</div>
                        )}
                    </h2>
                    {/* Mint Button */}
                    {!(maxMintPerWallet == 1) ? (
                        <div>
                            <input
                                type="number"
                                onChange={handleChange}
                                value={amountToMint}
                                placeholder='Amount to mint'
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-50 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 items-center"
                            />
                            <button onClick={handleMint}
                                disabled={amountLoading || mintedAmount === totalSupply || !address}
                                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg px-4 py-2 font-semibold disabled:bg-gray-400"
                            >Mint 1 for {collection.collection.price} APT</button>
                        </div>
                    ) : (
                        <div className='py-0 w-full'>
                            {minted ? (<div className='text-black font-bold text-xl text-center'>
                                You have minted one!
                            </div>) : (<button
                                disabled={amountLoading || mintedAmount === totalSupply || !address}
                                onClick={handleMint}
                                className='h-16 bg-blue-700 w-full text-white rounded-full mt-10 font-bold disabled:bg-gray-400'>
                                Mint For {collection.collection.price} APT
                            </button>)}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const query = `*[_type=="collection" && slug.current==$id][0]{
                _id,
                title,
                address,
                price,
                maxMintPerWallet,
                description,
                nftCollectionName,
                mainImage{
                asset
            },
            previewImage{
                asset
            },
            slug{
                current
            },
        creator->{
                _id,
                name,
                address,
                slug  {
                current
            },
        }
      }`
    const collection = await sanityClient.fetch(query, {
        id: params?.id
    })

    if (!collection) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            collection,
        }
    }
}