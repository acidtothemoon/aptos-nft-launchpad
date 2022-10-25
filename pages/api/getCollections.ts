import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { sanityClient } from "../../sanity";
import { Collection } from '../../typings';

const query = groq`
    *[_type=="collection"]
`;

type Data = {
    collections: Collection[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const collections: Collection[] = await sanityClient.fetch(query)

    res.status(200).json({ collections })
}