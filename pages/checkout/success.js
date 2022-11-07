import React from "react"
import { useStateContext } from "../../context/StateContext"

const success = () => {
    const { orderNumber } = useStateContext()
    return (
        <div>
            <h1>Success</h1>
            <h2>Your order number is:</h2>
            <h3>{orderNumber}</h3>
        </div>
    )
}

export default success
