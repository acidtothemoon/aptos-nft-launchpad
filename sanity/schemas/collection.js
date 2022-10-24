export default {
    name: 'collection',
    title: 'Collection',
    type: 'document',
    fields: [
        {
            name: 'title',
            description: 'Enter the title of the NFT Drop',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'string',
        },
        {
            name: 'nftCollectionName',
            title: 'Name of NFT Collection',
            type: 'string',
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96
            },
        },
        {
            name: 'maxMintPerWallet',
            title: 'Max Mint Per Wallet',
            type: 'number',
        },
        {
            name: 'creator',
            title: 'Creator',
            type: 'reference',
            to: {
                type: 'creator',
            }
        },
        {
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'previewImage',
            title: 'Preview Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
    ]
}