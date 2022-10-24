import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity';
import { Cursor, useTypewriter } from "react-simple-typewriter"
import { Collection } from '../../typings';
import Link from 'next/link';
import { AptosClient, TokenClient } from "aptos"


type Props = {
    collection: Collection
}

const NFTDropPage = (collection: Props) => {
    const [address, setAddress] = useState<String | null>(null)
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
    const [mintedAmount, setMintedAmount] = useState<number>(0)
    const [totalSupply, setTotalSupply] = useState<number>(0)
    const [amountLoading, setAmountLoading] = useState<boolean>(true)
    const [minted, setMinted] = useState<boolean>(true)


    const [text, count] = useTypewriter({
        words: [
            `${collection.collection.title}`,
        ],
        // loop: true,
        delaySpeed: 2000,
    })

    useEffect(() => {
        connectWallet()
    }, [])

    useEffect(() => {
        const fetchNFTDropData = async () => {
            setAmountLoading(true)
            const client = new AptosClient("https://fullnode.mainnet.aptoslabs.com/v1");
            const tokenClient = new TokenClient(client);
            const creator = ""
            const collectionName = ""
            const data = await tokenClient.getCollectionData(creator, collectionName)
            const { description, maximum, name, supply, uri } = data

            setMintedAmount(supply)
            setTotalSupply(maximum)
            setAmountLoading(false)
        }

        fetchNFTDropData()
    }, [])
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
            <div className='lg:col-span-4 bg-gradient-to-br from-blue-900 to-black pr-5 pl-5'>
                {/* Header */}
                <header className='flex flex-1 items-center justify-between text-white pt-8 '>
                    <Link href={'/'}>
                        <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
                            <span className='font-extrabold text-[#edebf0] underline decoration-pink-600'>
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
            <div className='flex flex-1 flex-col p-12 lg:col-span-6'>

                {/* Content */}
                <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0'>
                    <img className='w-80 object-cover pb-8 lg:h-100'
                        src={urlFor(collection.collection.mainImage).url()}
                    />
                    <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
                        {text}
                    </h1>
                    {/* <p className='pt-2 text-xl text-green-500'>13/21 Claimed</p> */}
                    <h2 className="animate-pulse text-sm uppercase text-gray-500 pb-2 tracking-[5px] md:tracking-[5px] py-5">
                        {amountLoading ? (
                            <div>
                                <h1>&nbsp;Loading supply count...</h1>
                                <img
                                    className='h-80 w-80 object-contain'
                                    src='https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif'
                                />
                            </div>

                        ) : (
                            <div>&nbsp; {mintedAmount}/{totalSupply}</div>
                        )}
                    </h2>


                </div>

                {/* Mint Button */}
                {(!minted) && <button
                    disabled={amountLoading || mintedAmount === totalSupply || !address}
                    className='h-16 bg-blue-700 w-full text-white rounded-full mt-10 font-bold disabled:bg-gray-400'>
                    Mint For 2.5 APT
                </button>}
                {(address) && (minted) && <div className='text-black font-bold text-xl text-center'>
                    You've minted one!
                </div>}

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