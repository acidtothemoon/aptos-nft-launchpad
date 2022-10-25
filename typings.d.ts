export { };

declare global {
    interface Window {
        martian: any;
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
    mintEndTime: string
    socials: Social[]
    maxMintPerWallet: number
    nftCollectionName: string
    address: string
    slug: {
        current: string
    }
    creator: Creator
    mainImage: Image
    previewImage: Image
}

interface SanityBody {
    _createdAt: string;
    _id: string;
    _rev: string;
    _updatedAt: string;
}

export interface Social extends SanityBody {
    _type: "social";
    title: string;
    url: string;
}