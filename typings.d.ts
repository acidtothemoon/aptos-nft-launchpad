export { };

declare global {
    interface Window {
        martian: any;
        pontem: any;
        aptos: any;
    }
}

export interface Image {
    asset: {
        url: string
    }
}

export interface Creator {
    _id: string
    name: string
    address: string
    slug: {
        current: string
    }
    image: Image
    bio: string
}

export interface Collection {
    _id: string
    title: string
    description: string
    price: number
    mintStartTime: string
    moduleId: string
    topazUrl: string
    soulffl3Url: string
    collection_configs: string
    socials: string[]
    maxMintPerWallet: number
    nftCollectionName: string
    resourceAccount: string
    slug: {
        current: string
    }
    creator: Creator
    mainImage: Image
    previewImage: Image
}
