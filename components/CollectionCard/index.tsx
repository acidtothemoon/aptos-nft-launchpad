import Link from 'next/link'
import React from 'react'
import { urlFor } from '../../sanity'
import { Collection } from '../../typings'

type Props = { collection: Collection }

const CollectionCard = ({ collection }: Props) => {
    return (
        <div>
            <Link href={`/nft/${collection.slug.current}`}>
                <div className='flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105'>
                    <img className='h-96 w-60 rounded-2xl object-cover'
                        src={urlFor(collection.mainImage).url()}
                        alt='' />
                    <div className='p-5'>
                        <h2 className='text-3xl'>{collection.title}</h2>
                    </div>
                    <p className='mt-2 text-sm text-gray-400'>{collection.description}</p>
                </div>
            </Link>
        </div >
    )
}

export default CollectionCard