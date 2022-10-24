import React, { useState } from 'react'
import { motion } from "framer-motion"
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';

type Props = {
    collection: Collection
}

const NFTDropPage = (collection: Props) => {
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
                    <img className='w-80 object-cover pb-10 lg:h-40'
                        src={urlFor(collection.collection.mainImage).url()}
                    />
                    <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
                        {collection.collection.title}
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