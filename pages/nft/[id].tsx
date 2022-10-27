import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { sanityClient } from '../../sanity'
import { Collection } from '../../typings'
import { AptosClient, TokenClient } from "aptos"
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import Countdown from '../../components/Countdown/index';
import Header from '../../components/Header'
import ProjectInfo from '../../components/ProjectInfo'
import MintInfo from '../../components/MintInfo'


type Props = {
    collection: Collection
}

const NFTDropPage = ({ collection }: Props) => {
    const [address, setAddress] = useState<string | null>(null)
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
    const [mintedAmount, setMintedAmount] = useState<number>(0)
    const [totalSupply, setTotalSupply] = useState<number>(0)
    const [amountLoading, setAmountLoading] = useState<boolean>(true)
    const [mintFee, setMintFee] = useState<number>(0)
    const [txHash, setTxHash] = useState<string>()
    const [availableToMintAmount, setAvailableToMintAmount] = useState<number>(0)
    const [availableMintChecking, setAvaiableMintChecking] = useState<boolean>(true)
    const [publicStartTime, setPublicStartTime] = useState<number>(new Date().valueOf())
    const [presaleStartTime, setPresaleStartTime] = useState<number>(new Date().valueOf())
    const [countDays, setCountDays] = useState<number>(0)
    const [countHours, setCountHours] = useState<number>(0)
    const [countMinutes, setCountMinutes] = useState<number>(0)
    const [countSeconds, setCountSeconds] = useState<number>(0)
    const [presaleStage, setPresaleStage] = useState<boolean>(false)
    const [publicStage, setPublicStage] = useState<boolean>(false)
    const [userAlreadyMinted, setUserAlreadyMinted] = useState<number>(0)

    useEffect(() => {
        if (!window.martian) {
            return
        }
        connectWallet()
    }, [address])

    useEffect(() => {
        const fetchNFTDropData = async () => {
            setAmountLoading(true)
            setAvaiableMintChecking(true)
            const client = new AptosClient("https://fullnode.mainnet.aptoslabs.com/v1")
            // const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1")
            const tokenClient = new TokenClient(client)

            const resourceAccount = collection.resourceAccount
            const collectionName = collection.nftCollectionName
            const data = await tokenClient.getCollectionData(resourceAccount, collectionName)

            const { description, maximum, name, supply, uri } = data

            const minted_supply = await client.getAccountResource(
                resourceAccount,
                "0x3::token::Collections"
            ).then(
                //@ts-ignore
                collectionsEvent => collectionsEvent.data.mint_token_events.counter
            ).catch(
                () => 0
            );

            setMintedAmount(minted_supply)

            if (collection.nftCollectionName == "Aptos Polar Bears") {
                setTotalSupply(700)
            } else {
                setTotalSupply(maximum)
            }

            setAmountLoading(false)

            if (!address) {
                return
            } else {
                const {
                    max_supply_per_user,
                    supply_per_wl: { handle: spw_handle },
                    mints_per_user: { handle: mpu_handle },
                    mint_fee_per_mille,
                    presale_mint_time,
                    public_mint_time,
                } = await client.getTableItem(
                    collection.collection_configs,
                    {
                        key_type: "0x1::string::String",
                        value_type: "0x4b8cec33043700c2e159b55d39dff908c28f21ebaf0d64b0539a465721021a3a::candy_machine_v2::CollectionConfig",
                        key: collectionName,
                    }
                );

                setMintFee(mint_fee_per_mille / 100000000)
                setPresaleStartTime(presale_mint_time * 1000)
                setPublicStartTime(public_mint_time * 1000)

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

                setAvailableToMintAmount(user_max_supply - user_minted_amount)
                setAvaiableMintChecking(false)
                setUserAlreadyMinted(user_minted_amount)
            }
        }

        fetchNFTDropData()
    }, [address, txHash])

    const connectWallet = async () => {
        if ("martian" in window) {
            const response = await window.martian.connect();
            const address = response.address
            setAddress(address)
            const isConnected = await window.martian.isConnected()
            if (isConnected) {
                setIsWalletConnected(true)
            }
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
        <div className='flex h-screen flex-col lg:grid lg:grid-cols-10 overflow-y-scroll'>
            <Head>
                <title>{collection.title} Mint Page</title>
            </Head>
            <Toaster position='bottom-center' />

            {/* Left */}
            <div className='lg:col-span-4 bg-gradient-to-r from-[#051818] to-[#0e3839] pr-5 pl-5'>

                <Header
                    isWalletConnected={isWalletConnected}
                    disconnect={disconnect}
                    connectWallet={connectWallet}
                    address={address}
                />

                <ProjectInfo collection={collection} />

            </div>

            {/* Right */}
            <div className='flex flex-1 flex-col p-12 lg:col-span-6 bg-black'>
                {/* Countdown */}
                <div>
                    {/* {
                        (!presaleStage && !publicStage) ? (
                            <div className='text-lg text-white flex justify-center text-center text-semibold'>
                                Presale Starts In
                            </div>
                        ) : null
                    }
                    {
                        presaleStage ? (
                            <div>
                                <div className='text-lg text-white flex justify-center text-center text-semibold'>
                                    Presale Start!
                                </div>
                                <div className='text-lg text-white flex justify-center text-center text-semibold'>
                                    Public Starts In
                                </div>
                            </div>
                        ) : null
                    }
                    {
                        publicStage ? (
                            <div className='text-lg text-white flex justify-center text-center text-semibold'>
                                Public Starts!
                            </div>
                        ) : null
                    } */}


                    <div className='flex py-10 justify-center'>
                        <Countdown
                            presaleStartTime={presaleStartTime}
                            publicStartTime={publicStartTime}
                            countDays={countDays}
                            countHours={countHours}
                            countMinutes={countMinutes}
                            countSeconds={countSeconds}
                            setCountDays={setCountDays}
                            setCountHours={setCountHours}
                            setCountMinutes={setCountMinutes}
                            setCountSeconds={setCountSeconds}
                            setPresaleStage={setPresaleStage}
                            setPublicStage={setPublicStage}
                        />
                    </div>
                </div>

                {/* RightContent */}
                <MintInfo
                    collection={collection}
                    amountLoading={amountLoading}
                    mintedAmount={mintedAmount}
                    totalSupply={totalSupply}
                    availableMintChecking={availableMintChecking}
                    availableToMintAmount={availableToMintAmount}
                    address={address} setTxHash={setTxHash}
                    txHash={txHash}
                    mintFee={mintFee}
                    userAlreadyMinted={userAlreadyMinted}
                />
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
                collection_configs,
                mintStartTime,
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