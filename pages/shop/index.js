import React from "react"
import { client } from "../../lib/client"
import Product from "../../components/Product"

const Shop = ({ products }) => {
    return (
        <div className="Shop-page">
            <div className="shop-header">
                <h1>
                    Shop Our Selection of the{" "}
                    <span className="header-accent">
                        Highest Quality Products
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
    const query = '*[_type == "product"]'
    const products = await client.fetch(query)

    return {
        props: { products },
    }
}

export default Shop
