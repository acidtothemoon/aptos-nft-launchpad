import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { sanityClient } from "../../sanity";
import { Creator } from '../../typings';

const query = groq`
    *[_type=="creator"]
`;

type Data = {
    creator: Creator;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const creator: Creator = await sanityClient.fetch(query)

    res.status(200).json({ creator })
}