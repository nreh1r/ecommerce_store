import React from "react"
import { client } from "../../lib/client"
import Product from "../../components/Product"
const Speakers = ({ products }) => {
    return (
        <div className="Shop-page">
            <div className="shop-header">
                <h1>
                    Shop Our Selection of the{" "}
                    <span className="header-accent">
                        Highest Quality Speakers
                    </span>
                </h1>
            </div>
            <div className="products-container">
                {products?.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export const getServerSideProps = async () => {
    const query = '*[_type == "product" && "speaker" in tags]'
    const products = await client.fetch(query)

    const bannerQuery = '*[_type == "banner"]'
    const bannerData = await client.fetch(bannerQuery)

    return {
        props: { products, bannerData },
    }
}

export default Speakers
