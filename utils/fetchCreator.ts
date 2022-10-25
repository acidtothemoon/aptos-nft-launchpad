import { Creator } from "../typings";

export const fetchExperiences = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCreator`)

    const data = await res.json()
    const creator: Creator = data.creator

    console.log("fetching", creator)

    return creator
}