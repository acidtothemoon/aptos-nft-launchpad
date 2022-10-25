import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import CollectionCard from '../components/CollectionCard'
import { sanityClient } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}


const Home = ({ collections }: Props) => {
  return (
    <div className='py-8 mx-auto flex min-h-screen flex-col md:py-20 md:px-10 2xl:px-0 bg-black'>
      <Head>
        <title>Aptos NFT Launchpad</title>
      </Head>

      <h1 className='px-10 md:px-20 mb-10 text-3xl md:text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-[#236938] to-[#05e061] '>
        <span className='font-extrabold underline decoration-green-600'>
          Aptos
        </span>
        {' '} NFT Launchpad
      </h1>
      <div className=' px-10'>
        <main className='bg-gradient-to-r from-green-900 to-green-900 p-10 shadow-xl shadow-[#0ca64c]/80 rounded-lg'>
          <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 space-y-15'>
            {collections?.map((collection, i) => (
              <div key={i}>
                <CollectionCard collection={collection} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  console.log("start querying")
  const query = `*[_type=="collection"]{
    _id,
    title,
    address,
    price,
    description,
    maxMintPerWallet,
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
