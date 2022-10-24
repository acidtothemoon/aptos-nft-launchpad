import React from 'react'

type Props = {}

const NFTDropPage = (props: Props) => {
    return (
        <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
            {/* Left */}
            <div className='lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500'>
                <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
                    <div className='bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl'>
                        <img
                            className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                            src="https://links.papareact.com/8sg" />

                    </div>
                    <div className='text-center p-5 space-y-2'>
                        <h1 className='text-4xl font-bold text-white'>Ape</h1>
                        <h2 className='text-xl text-gray-300'>Collection</h2>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default NFTDropPage