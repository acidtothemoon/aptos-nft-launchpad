import { Collection } from "../typings";

export const fetchCollections = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCollections`)

    const data = await res.json()
    const collections: Collection[] = data.collections

    console.log("fetching", collections)

    return collections
}