import React, { useState } from "react"

import { client, urlFor } from "../../lib/client"

import {
    AiOutlineMinus,
    AiOutlinePlus,
    AiFillStar,
    AiOutlineStar,
} from "react-icons/ai"

import { Product } from "../../components"
import { useStateContext } from "../../context/StateContext"
import { useRouter } from "next/router"

const ProductDetails = ({ product, products }) => {
    const { image, name, details, price, choices } = product
    const [index, setIndex] = useState(0)
    const [productChoice, setProductChoice] = useState(
        choices !== undefined ? choices[0] : ""
    )
    const [prodId, setProdId] = useState(0)
    const { decQty, incQty, qty, onAdd } = useStateContext()
    const router = useRouter()

    function buyNow(product, qty) {
        onAdd(product, qty)
        router.push("/checkout")
    }

    let options
    if (choices !== undefined) {
        options = choices.map((choice, id) => (
            <option value={choice} key={id} id={id}>
                {choice}
            </option>
        ))
    }

    function handleChange(event) {
        setProductChoice(event.target.value)
        setProdId(choices.indexOf(event.target.value))
    }

    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className="image-container">
                        <img
                            src={urlFor(image && image[index])}
                            className="product-detail-image"
                        />
                    </div>
                    <div className="small-images-container">
                        {image?.map((item, i) => (
                            <img
                                src={urlFor(item)}
                                className={
                                    i === index
                                        ? "small-image selected-image"
                                        : "small-image"
                                }
                                onMouseEnter={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-detail-desc">
                    <h1>{name}</h1>
                    <div className="reviews">
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar />
                        <p>(20)</p>
                    </div>
                    <h4>Details</h4>
                    <p>{details}</p>
                    <p className="price">${price}</p>
                    <div className="quantity">
                        <h3>Quantity:</h3>
                        <p className="quantity-desc">
                            <span className="minus" onClick={decQty}>
                                <AiOutlineMinus />
                            </span>
                            <span className="num">{qty}</span>
                            <span className="plus" onClick={incQty}>
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <div className="buttons">
                        <button
                            type="button"
                            className="add-to-cart"
                            onClick={() => onAdd(product, qty)}
                        >
                            Add to Cart
                        </button>
                        <button
                            type="button"
                            className="buy-now"
                            onClick={() => buyNow(product, qty)}
                        >
                            Buy Now
                        </button>
                    </div>
                    {choices && (
                        <select onChange={(event) => handleChange(event)}>
                            {options}
                        </select>
                    )}
                </div>
            </div>

            <div className="maylike-products-wrapper">
                <h2>You May Also Like</h2>
                <div className="marquee">
                    <div className="maylike-products-container track">
                        {products.map((item) => (
                            <Product key={item._id} product={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }
    `

    const products = await client.fetch(query)

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current,
        },
    }))

    return {
        paths,
        fallback: "blocking",
    }
}

export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`
    const productsQuery = '*[_type == "product"]'
    const product = await client.fetch(query)
    const products = await client.fetch(productsQuery)

    return {
        props: { products, product },
    }
}

export default ProductDetails
