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
            name: 'moduleId',
            title: 'Module Id',
            type: 'string',
        },
        {
            name: 'nftCollectionName',
            title: 'Name of NFT Collection',
            type: 'string',
        },
        {
            name: 'resourceAccount',
            title: 'Resource Account',
            type: 'string',
        },
        {
            name: 'collection_configs',
            title: 'Collection Configs',
            type: 'string',
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
            name: 'mintStartTime',
            title: 'Mint Start Time',
            type: 'datetime'
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
        {
            name: 'socials',
            title: 'Socials',
            type: 'array',
            of: [{ type: 'string' }]
        },
    ]
}