import React from "react"

import { useStateContext } from "../context/StateContext"
import { urlFor } from "../lib/client"

const Order = () => {
    const {
        totalPrice,
        totalQuantities,
        cartItems,
        formData,
        handleChange,
        shipping,
    } = useStateContext()
    console.log(cartItems)
    const items = cartItems.map((item, i) => {
        return (
            <div key={i} className="checkout-item">
                {/* <img
                    src={urlFor(item?.image[0])}
                    alt="Product Image"
                    className="checkout-photo"
                /> */}
                <div className="name-quantity">
                    <p>{item.name}</p>
                    <p>Qty {item.quantity}</p>
                </div>

                <p>${item.price * item.quantity}</p>
            </div>
        )
    })
    return (
        <div className="order-container">
            <div className="order">
                <h4 className="order-title">YOUR ORDER</h4>
                <div className="order-header">
                    <h5>PRODUCT</h5>
                    <h5>SUBTOTAL</h5>
                </div>
                {items}
                <div className="subtotal">
                    <p>SUBTOTAL</p>${totalPrice}
                </div>
                <div className="shipping">
                    <p>SHIPPING</p>
                    <p>$25.00</p>
                </div>
            </div>
            <div className="checkout-total">
                <p>TOTAL</p>
                <p>${totalPrice + shipping}</p>
            </div>
            <div className="etransfer">
                <h4 className="etransfer-title">Etransfer</h4>
                <p className="etransfer-description">
                    After placing your order, please send an Email money
                    transfer to us (thru Interac or any other Email Transfer
                    means).
                </p>
            </div>
        </div>
    )
}

export default Order
