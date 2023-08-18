import Image from "next/image"
import styles from "../styles/Home.module.css"
import NftBox from "../components/NftBox"
import networkMapping from "../constants/network-mapping.json"
import { useMoralis } from "react-moralis"
import { useQuery, gql } from "@apollo/client"
// import { GET_ACTIVE_ITEMS } from "../constants/subgraphQueries.js"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: null }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NFTMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled && chainId ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return marketplaceAddress ? (
                                <NftBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            ) : (
                                <div>
                                    Network error, please switch to a supported
                                    network.{" "}
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
