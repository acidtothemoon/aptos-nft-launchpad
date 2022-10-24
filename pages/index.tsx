import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import CollectionCard from '../components/CollectionCard'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className='max-w-7xl mx-auto flex min-h-screen flex-col py-20 px-10 2xl:px-0'>
      <Head>
        <title>Only2</title>
      </Head>

      <h1 className='mb-10 text-4xl font-extralight'>
        <span className='font-extrabold text-[#090510] underline decoration-pink-600'>
          Only2
        </span>
        {' '} NFT Launchpad
      </h1>

      <main className='bg-slate-100 p-10 shadow-xl shadow-blue-400/20'>
        <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {collections.map((collection) => (
            <CollectionCard collection={collection} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home


export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type=="collection"]{
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

  const collections = await sanityClient.fetch(query)
  console.log(collections)
  return {
    props: {
      collections,
    },
  }
}