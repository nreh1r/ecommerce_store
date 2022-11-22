import React, { useEffect, useState } from "react"

import { useStateContext } from "../../context/StateContext"
import { client } from "../../lib/client"

import Order from "../../components/Order"

const Checkout = ({ discounts }) => {
    const {
        totalPrice,
        totalQuantities,
        cartItems,
        formData,
        handleChange,
        submitHandler,
        requestStatus,
    } = useStateContext()

    const [discountCodes, setDiscountCodes] = useState([])
    const [discountPercent, setDiscountPercent] = useState(0)
    const [inputData, setInputData] = useState("")
    const [isInvalidCode, setIsInvalidCode] = useState(false)

    useEffect(() => {
        setDiscountCodes(discounts[0].codes)
    }, [])
    console.log("Discount Codes:")
    console.log(discountCodes)

    function inputChange(event) {
        const { value } = event.target
        setInputData(value)
    }

    function applyDiscount() {
        const discountIndex = discountCodes.findIndex(
            (code) => code.code === inputData
        )
        if (discountIndex !== -1) {
            setIsInvalidCode(false)
            const percent = discountCodes[discountIndex].percent / 100
            setDiscountPercent(percent)
        } else {
            setIsInvalidCode(true)
        }
    }

    let buttonText = ""

    if (requestStatus === "pending") {
        buttonText = "Sending..."
    } else if (requestStatus === "success") {
        buttonText = "Order Placed!"
    } else if (requestStatus === "error") {
        buttonText = "Error!"
    } else {
        buttonText = "Place Order"
    }

    let style = "rgba(165, 165, 165, 0.1)"

    if (isInvalidCode) {
        style = "rgba(240, 45, 52, 0.25)"
    }

    return (
        <div className="checkout-container">
            <div className="form-container">
                <h1 className="form-header">Billing Details</h1>
                <form className="checkout-form" onSubmit={submitHandler}>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(event) => handleChange(event)}
                        placeholder="First Name"
                        className="form-input name"
                    />
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(event) => handleChange(event)}
                        placeholder="Last Name"
                        className="form-input name"
                    />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={(event) => handleChange(event)}
                        placeholder="Email Address"
                        className="form-input"
                    />
                    <h4 className="canada">Canada</h4>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={(event) => handleChange(event)}
                        placeholder="Address"
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="unit"
                        id="unit"
                        value={formData.unit}
                        onChange={(event) => handleChange(event)}
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={(event) => handleChange(event)}
                        placeholder="Town/City"
                        className="form-input"
                    />
                    <select
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={(event) => handleChange(event)}
                        className="form-input"
                    >
                        <option value="select">Province/Territory</option>
                        <option value="alberta">Alberta</option>
                        <option value="britishColumbia">
                            British Columbia
                        </option>
                        <option value="manitoba">Manitoba</option>
                        <option value="newBrunswick">New Brunswick</option>
                        <option value="newfoundlandAndLabrador">
                            Newfoundland and Labrador
                        </option>
                        <option value="northwestTerritories">
                            Northwest Territories
                        </option>
                        <option value="novaScotia">Nova Scotia</option>
                        <option value="nunavut">Nunavut</option>
                        <option value="ontario">Ontario</option>
                        <option value="princeEdwardIsland">
                            Prince Edward Island
                        </option>
                        <option value="quebec">Quebec</option>
                        <option value="saskatchewan">Saskatchewan</option>
                        <option value="yukon">Yukon</option>
                    </select>
                    <input
                        type="text"
                        name="postal"
                        id="postal"
                        value={formData.postal}
                        onChange={(event) => handleChange(event)}
                        placeholder="Postal Code"
                        className="form-input"
                    />
                    <div className="submit-checkout">
                        <button className="submit-button">{buttonText}</button>
                    </div>
                </form>
            </div>
            <div>
                <Order discountPercent={discountPercent} />
                <div className="promo-code">
                    <h4>Have A Promo Code?</h4>
                </div>
                <div className="discount_container">
                    <input
                        type="text"
                        placeholder="Discount Code"
                        name="discount"
                        value={inputData}
                        onChange={inputChange}
                        className="discount_input"
                        style={{ backgroundColor: `${style}` }}
                    ></input>
                    <button className="discount_button" onClick={applyDiscount}>
                        Apply
                    </button>
                </div>
                {isInvalidCode && (
                    <p className="code-not-found">Discount Code Not Found</p>
                )}
            </div>
        </div>
    )
}

export const getServerSideProps = async () => {
    const query = '*[_type == "discount"]'
    const discounts = await client.fetch(query)

    return {
        props: { discounts },
    }
}

export default Checkout
