import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { useTypewriter } from "react-simple-typewriter"
import { Collection } from '../../typings'
import Link from 'next/link'
import { AptosClient, TokenClient } from "aptos"
import toast, { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import Countdown from '../../components/Countdown/index';
import { SocialIcon } from "react-social-icons"



type Props = {
    collection: Collection
}

const NFTDropPage = ({ collection, }: Props) => {
    const [address, setAddress] = useState<string | null>(null)
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
    const [mintedAmount, setMintedAmount] = useState<number>(0)
    const [totalSupply, setTotalSupply] = useState<number>(0)
    const [amountLoading, setAmountLoading] = useState<boolean>(true)
    const [amountToMint, setAmountToMint] = useState<number>(1)
    const [maxMintPerWallet, setMaxMintPerWallet] = useState<number>(1)
    const [thisUserMinted, setThisUserMinted] = useState<number>(0)
    const [txHash, setTxHash] = useState<string>()
    const [countEnd, setCountEnd] = useState<boolean>(false)
    const [availableToMintAmount, setAvailableToMintAmount] = useState<number>(0)

    const [countDays, setCountDays] = useState<number>(0)
    const [countHours, setCountHours] = useState<number>(0)
    const [countMinutes, setCountMinutes] = useState<number>(0)
    const [countSeconds, setCountSeconds] = useState<number>(0)

    const [text, count] = useTypewriter({
        words: [
            `${collection.title}`,
        ],
        delaySpeed: 2000,
    })

    useEffect(() => {
        if (!window.martian) {
            return
        }
        connectWallet()
        setMaxMintPerWallet(collection.maxMintPerWallet)

    }, [address])

    useEffect(() => {
        const fetchNFTDropData = async () => {
            setAmountLoading(true)
            const client = new AptosClient("https://fullnode.mainnet.aptoslabs.com/v1");
            // const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1")
            const tokenClient = new TokenClient(client);

            const resourceAccount = collection.resourceAccount
            const collectionName = collection.nftCollectionName
            const data = await tokenClient.getCollectionData(resourceAccount, collectionName)

            const { description, maximum, name, supply, uri } = data

            setMintedAmount(supply)
            setTotalSupply(maximum)
            setAmountLoading(false)

            if (!address) {
                return
            } else {
                const { max_supply_per_user, supply_per_wl: { handle: spw_handle }, mints_per_user: { handle: mpu_handle } } = await client.getTableItem(
                    collection.collection_configs,
                    {
                        key_type: "0x1::string::String",
                        value_type: "0xdf5c814388f4162f353e14f6123fcba8f39a958e4a2640e38e9e2c7cdfd2ac1d::candy_machine_v2::CollectionConfig",
                        key: collectionName,
                    }
                );
                console.log(max_supply_per_user, spw_handle, mpu_handle);

                const user_max_supply = await client.getTableItem(
                    spw_handle,
                    {
                        key_type: "address",
                        value_type: "u64",
                        key: address,
                    }
                )
                    .then(wl_max => wl_max)
                    .catch(() => max_supply_per_user);

                const user_minted_amount = await client.getTableItem(
                    mpu_handle,
                    {
                        key_type: "address",
                        value_type: "u64",
                        key: address,
                    }
                )
                    .then(mintedAmount => mintedAmount)
                    .catch(() => 0);
                console.log("user_max_supply", user_max_supply);
                console.log("user_minted_amount", user_minted_amount);
            }
        }

        fetchNFTDropData()
    }, [address, txHash])

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
        if (!address) {
            toast.error("Connect wallet first!")
            return
        }
        if (amountToMint + thisUserMinted > maxMintPerWallet) {
            toast.error(`You can only mint ${maxMintPerWallet - thisUserMinted} more!`)
            setAmountToMint(maxMintPerWallet - thisUserMinted)
            return
        }
        if (amountLoading) {
            toast.error("Still loading...")
            return
        }
        if (mintedAmount === totalSupply) {
            toast.error("Minted out")
            return
        }
        if (countDays === 0 && countHours === 0 && countMinutes === 0 && countSeconds === 0) {
            toast.error("Mint is over")
            return
        }

        // Generate a transaction
        const payload = {
            type: "entry_function_payload",
            function: "0xdf5c814388f4162f353e14f6123fcba8f39a958e4a2640e38e9e2c7cdfd2ac1d::candy_machine_v2::mint_tokens",
            type_arguments: [],
            arguments: [
                `${collection.creator.address}`,
                `${collection.nftCollectionName}`,
                amountToMint,
            ]
        };
        console.log(payload)

        const transaction = await window.martian.generateTransaction(address, payload);
        const txnHash = await window.martian.signAndSubmitTransaction(transaction);

        setTxHash(txnHash)
        console.log(txnHash);
    }

    return (
        <div className='flex h-screen flex-col lg:grid lg:grid-cols-10 overflow-y-scroll'>
            <Head>
                <title>{collection.title} Mint Page</title>
            </Head>
            <Toaster position='bottom-center' />

            {/* Left */}
            <div className='lg:col-span-4 bg-gradient-to-r from-[#051818] to-[#0e3839] pr-5 pl-5'>
                {/* Header */}
                <header className='flex flex-1 items-center justify-between text-white pt-8 '>
                    <Link href={'/'}>
                        <h1 className='w-52 cursor-pointer text-xl font-bold sm:w-80 text-transparent text-white md:text-5xl' >
                            <span className='font-extrabold '>
                                Acid Labs Aptos
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
                {/* <Header address={address} setAddress={setAddress} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} /> */}
                {address && (
                    <p className='text-right text-sm text-[#52dc82] py-2 font-semibold'>
                        You're logged in with {address.substring(0, 5)}...{address.substring(address.length - 5, address.length)}
                    </p>
                )}

                <div className='flex flex-col items-center justify-center py-10 lg:min-h-screen lg:pb-80'>
                    <div className='bg-gradient-to-br from-blue-800 to-white p-1 md:p-2 rounded-xl'>
                        <img
                            className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                            src={urlFor(collection?.previewImage).url()} />
                    </div>
                    <motion.div
                        initial={{
                            x: -500,
                            opacity: 0,
                            scale: 0.5,
                        }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 1.5,
                        }}
                        className="flex flex-row items-center py-3"
                    >
                        {/** Social icon */}
                        {collection.socials?.map((social) => (
                            <SocialIcon
                                url={social}
                                fgColor="gray"
                                bgColor="transparent"
                            />
                        ))}
                    </motion.div>
                    <div className='text-center p-2 lg:p-3 space-y-2'>
                        <h1 className=' text-4xl font-bold text-white'>{collection?.title}</h1>
                        <h2 className='text-xl text-gray-300'>{collection?.description}</h2>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className='flex flex-1 flex-col p-12 lg:col-span-6 bg-black'>
                {/* Countdown */}
                <div>
                    {(!countEnd) ? (
                        <div>
                            <div className='text-lg text-white flex justify-center text-center'>
                                Minting Starts At:
                            </div>
                            {/* <div className='text-white text-2xl flex justify-center py-2'>{new Date(collection?.mintStartTime).toDateString()}</div> */}
                        </div>
                    ) : (
                        <div>
                            <div className='text-lg text-white flex justify-center text-center'>
                                Minting Ends In:
                            </div>
                            <div className='text-white text-2xl flex justify-center py-2'>{new Date(collection?.mintEndTime).toDateString()}</div>
                        </div>
                    )}

                    <div className='flex py-10 justify-center'>
                        <Countdown countEnd={countEnd} setCountEnd={setCountEnd} mintStartTime={collection?.mintStartTime} mintEndTime={collection?.mintEndTime} countDays={countDays} countHours={countHours} countMinutes={countMinutes} countSeconds={countSeconds} setCountDays={setCountDays} setCountHours={setCountHours} setCountMinutes={setCountMinutes} setCountSeconds={setCountSeconds} />
                    </div>
                </div>

                {/* <div className='text-lg text-white flex justify-center text-center'>
                    Minting Starts At:
                </div>
                <div className='text-white text-2xl flex justify-center py-2'>{new Date(collection?.mintStartTime).toDateString()}</div>
                <div className='flex py-5 justify-center'>
                    <Countdown mintStartTime={collection?.mintStartTime} countDays={countDays} countHours={countHours} countMinutes={countMinutes} countSeconds={countSeconds} setCountDays={setCountDays} setCountHours={setCountHours} setCountMinutes={setCountMinutes} setCountSeconds={setCountSeconds} />
                </div> */}
                {/* Content */}
                <div className='flex flex-2 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0 py-2'>
                    <img className='w-80 object-cover lg:h-100 rounded-xl'
                        src={urlFor(collection?.mainImage).url()}
                    />
                    <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold py-5 text-[#ecdcdc]'>
                        {text}
                    </h1>
                    {/* <p className='pt-2 text-xl text-green-500'>13/21 Claimed</p> */}
                    <h2 className=" text-sm uppercase text-white pb-2 tracking-[5px] md:tracking-[5px] py-5">
                        {amountLoading ? (
                            <div className='justify-center items-center'>
                                <h1 className='animate-pulse'>&nbsp;Loading supply count...</h1>
                            </div>
                        ) : (
                            <div>&nbsp; {mintedAmount}/{totalSupply}</div>
                        )}
                    </h2>

                    <div className='text-white font-semibold tracking-[5px] py-2'>
                        You can mint {availableToMintAmount}!
                    </div>

                    {/* Mint Button */}
                    {(availableToMintAmount > 0) && ((availableToMintAmount == 1) ? (
                        <div className='w-full'>
                            {<motion.div
                                whileTap={{
                                    scale: 0.8,
                                    rotate: 0,
                                    borderRadius: "100%"
                                }}>
                                <button
                                    onClick={handleMint}
                                    className='h-16 bg-[#0e3839] w-3/5 rounded-full mt-10 '>
                                    <p className='text-white font-semibold tracking-[5px] animate-pulse'>
                                        Mint 1 For {collection?.price} APT
                                    </p>
                                </button>
                            </motion.div>}
                        </div>
                    ) : (
                        <div className='py-5 truncate space-x-2'>
                            <input
                                type="number"
                                onChange={handleChange}
                                value={amountToMint}
                                placeholder='Amount to mint'
                                className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 items-center"
                            />
                            <button onClick={handleMint}
                                className="text-white bg-[#0e3839] rounded-lg px-4 py-2 font-semibold"
                            >Mint {amountToMint ? amountToMint : 1} for {collection?.price * amountToMint ? collection?.price * amountToMint : collection?.price} APT</button>
                        </div>
                    ))}

                    {/* If TxHash */}
                    {(txHash) && (
                        <a target='_blank' href={`https://explorer.aptoslabs.com/txn/${txHash}`} >
                            <div className='py-5 text-white font-bold text-lg'>&nbsp;Successfully minted {amountToMint}!</div>
                            <div className='text-white font-bold animate-pulse py-3'>
                                &nbsp;Click to check your transaction
                            </div>
                        </a>
                    )}

                    {/* If cannot mint */}
                    {(!availableToMintAmount) && (
                        <div>
                            Sorry, You're not able to mint
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
                resourceAccount,
                price,
                collection_configs,
                mintStartTime,
                mintEndTime,
                socials,
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
    // const socials: Social[] = await fetchSocials();

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