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
    const { image, name, details, price } = product
    const [index, setIndex] = useState(0)
    const [chosenOption, setChosenOption] = useState(
        product.options !== undefined ? product.options[0] : ""
    )
    const [isChosen, setIsChosen] = useState(false)
    const { decQty, incQty, qty, onAdd } = useStateContext()
    const router = useRouter()

    function buyNow(product, qty, chosenOption) {
        onAdd(product, qty, chosenOption)
        router.push("/checkout")
    }

    let prod_types
    if (product.options !== undefined) {
        prod_types = product.options.map((option, id) => {
            const isSoldOut = option.stock === 0 ? true : false
            return (
                <option
                    value={option.option}
                    disabled={isSoldOut}
                    key={option._key}
                    id={id}
                >
                    {option.option}
                    {isSoldOut && ": Sold Out"}
                </option>
            )
        })
    }
    function handleChange(event) {
        const option_index = product.options.findIndex(
            (option) => option.option === event.target.value
        )
        if (option_index < 0) {
            option_index = 0
        }
        if (event.target.value === "") {
            setIsChosen(false)
        } else {
            setIsChosen(true)
        }
        setChosenOption(product.options[option_index])
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
                                key={i}
                                src={urlFor(item)}
                                alt="Product Image"
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
                    <p className="price">${chosenOption.price}</p>
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
                            onClick={() => onAdd(product, qty, chosenOption)}
                        >
                            Add to Cart
                        </button>
                        <button
                            type="button"
                            className="buy-now"
                            onClick={() => buyNow(product, qty, chosenOption)}
                        >
                            Buy Now
                        </button>
                    </div>
                    {product.options && (
                        <select
                            onChange={(event) => handleChange(event)}
                            className="options-container"
                        >
                            <option value="">Please Select a Model</option>
                            {prod_types}
                        </select>
                    )}
                    {isChosen && (
                        <span className="stock-count">
                            {chosenOption.stock} in stock
                        </span>
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
