import React from 'react'
import { urlFor } from '../../sanity'
import { Collection } from '../../typings'
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
            <div className="flex flex-row items-center py-3 lg:py-5"
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
                <div className=''></div>
            </div>
            <div className='space-x-2'>
                {collection.topazUrl ? (<a target="_blank" href={`${collection.topazUrl}`}>
                    <button className='text-white bg-[#0e3839] rounded-lg px-4 py-2 font-semibold'>
                        Topaz
                    </button>
                </a>) : null}
                {collection.souffl3Url ? (<a target="_blank" href={`${collection.souffl3Url}`}>
                    <button className='text-white bg-[#0e3839] rounded-lg px-4 py-2 font-semibold'>
                        Souffl3
                    </button>
                </a>) : null}
            </div>
            <div className='text-center p-2 lg:p-3 space-y-2'>
                <h1 className=' text-4xl font-bold text-white'>{collection?.title}</h1>
                <div>
                    <h2 className='text-xl text-gray-300 font-semibold'>{collection?.description}</h2>
                </div>
            </div>
        </div>
    )
}

export default ProjectInfo
