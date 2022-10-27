import React from 'react'
import { urlFor } from '../../sanity'
import { Collection } from '../../typings'
import { motion } from "framer-motion"
import { SocialIcon } from "react-social-icons"



interface Props {
    collection: Collection
}

const ProjectInfo = ({ collection }: Props) => {
    return (
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
                className="flex flex-row items-center py-3 lg:py-5"
            >
                {/** Social icon */}
                {collection.socials?.map((social) => (
                    <SocialIcon
                        key={social}
                        url={social}
                        fgColor="gray"
                        bgColor="transparent"
                    />
                ))}
            </motion.div>
            <div className='text-center p-2 lg:p-3 space-y-2'>
                <h1 className=' text-4xl font-bold text-white'>{collection?.title}</h1>
                {(collection.nftCollectionName == "Aptos Polar Bears") ? (<div>
                    <h2 className='text-xl text-gray-300 text-semibold'>A collection of 700 polar bears that have evolved and turned into something vicious after enduring the harshest climate on the planet.</h2>

                </div>) : (<div>
                    <h2 className='text-xl text-gray-300 text-semibold'>{collection?.description}</h2>
                </div>)}
            </div>
        </div>
    )
}

export default ProjectInfo