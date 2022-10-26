import type { GetServerSideProps, GetStaticProps } from 'next'
import Head from 'next/head'
import CollectionCard from '../components/CollectionCard'
import { sanityClient } from '../sanity'
import { fetchCollections } from '../utils/fetchCollections'
import { Collection } from '../typings';


interface Props {
  collections: Collection[]
}


const Home = ({ collections }: Props) => {
  return (
    <div className='py-8 mx-auto flex min-h-screen flex-col md:py-20 md:px-10 2xl:px-0 bg-black'>
      <Head>
        <title>Aptos NFT Launchpad</title>
      </Head>

      <h1 className='px-6 md:px-20 mb-10 text-3xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#11bbca] to-[#036e30] '>
        <span className='font-extrabold '>
          Aptos
        </span>
        {' '} NFT Launchpad
      </h1>
      <div className='px-10'>
        <main className='bg-gradient-to-r from-[#051818] to-[#0e3839] p-10 shadow-xl shadow-[#0e3839]/80 rounded-lg'>
          <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 space-y-15'>
            {collections?.sort((a, b) => (a.mintStartTime ? (a.mintStartTime) : "2050-02-12T09:15:00Z").localeCompare((b.mintStartTime ? (b.mintStartTime) : ("2050-02-12T09:15:00Z"))))
              .map((collection, i) => (
                <div key={i} className='py-4'>
                  <CollectionCard collection={collection} />
                </div>
              ))}
          </div>
        </main>
      </div>
      <div className='flex justify-center py-10 sm:py-20'>
        <a target="_blank" href="https://twitter.com/acidmonkeys">
          <h3 className=' text-white text-end'>
            Powered by Acid Labs
          </h3>
        </a>
      </div>
    </div>
  )
}

export default Home


// export const getStaticProps: GetStaticProps<Props> = async () => {
//   const collections: Collection[] = await fetchCollections()

//   return {
//     props: {
//       collections,
//     },
//     revalidate: 10,
//   }
// }


export const getServerSideProps: GetServerSideProps = async () => {
  console.log("start querying")
  const query = `*[_type=="collection"]{
    _id,
    title,
    address,
    price,
    description,
    mintStartTime,
    mintEndTime,
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