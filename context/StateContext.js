import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"

const Context = createContext()

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        unit: "",
        city: "",
        province: "",
        postalCode: "",
        email: "",
    })
    const [shipping, setShipping] = useState(25)
    const [orderNumber, setOrderNumber] = useState("")
    const [requestStatus, setRequestStatus] = useState("")
    const [requestError, setRequestError] = useState("")
    const router = useRouter()
    const [shopDropDown, setShopDropDown] = useState(false)

    let foundProduct
    let index

    const onAdd = (product, quantity) => {
        const checkProducInCart = cartItems.find(
            (item) => item._id === product._id
        )

        setTotalPrice((prevTotalPrice) => {
            return prevTotalPrice + parseInt(product.price) * quantity
        })

        setTotalQuantities(
            (prevTotalQuantities) => prevTotalQuantities + quantity
        )

        if (checkProducInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id)
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity,
                    }
            })

            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity

            setCartItems([...cartItems, { ...product }])
        }

        toast.success(`${qty} ${product.name} added to the cart`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)
        const newCartItems = cartItems.filter(
            (item) => item._id !== product._id
        )

        setTotalPrice(
            (prevTotalPrice) =>
                prevTotalPrice - foundProduct.price * foundProduct.quantity
        )
        setTotalQuantities(
            (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
        )
        setCartItems(newCartItems)
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id)

        const newCartItems = cartItems.filter((item) => item._id !== id)

        if (value === "inc") {
            setCartItems([
                ...newCartItems,
                { ...foundProduct, quantity: foundProduct.quantity + 1 },
            ])
            setTotalPrice(
                (prevTotalPrice) => prevTotalPrice + foundProduct.price
            )
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1)
        } else if (value === "dec") {
            if (foundProduct.quantity > 1) {
                setCartItems([
                    ...newCartItems,
                    { ...foundProduct, quantity: foundProduct.quantity - 1 },
                ])
                setTotalPrice(
                    (prevTotalPrice) => prevTotalPrice - foundProduct.price
                )
                setTotalQuantities(
                    (prevTotalQuantities) => prevTotalQuantities - 1
                )
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }
    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1

            return prevQty - 1
        })
    }

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    async function submitHandler(event) {
        event.preventDefault()
        setRequestStatus("pending")

        // Get order number
        const orderNumber = nanoid()
        setOrderNumber(orderNumber)

        const orderData = {
            ...formData,
            orderNumber,
            cartItems,
            totalPrice,
            totalQuantities,
        }

        try {
            await sendOrderData(orderData)
            setRequestStatus("success")
            setFormData({
                firstName: "",
                lastName: "",
                address: "",
                unit: "",
                city: "",
                province: "",
                postalCode: "",
                email: "",
            })

            setTimeout(() => {
                setRequestStatus("")
            }, 1000)
        } catch (error) {
            setRequestStatus("error")
            setRequestError(error.message)
            setTimeout(() => {
                setRequestStatus("")
            }, 2000)
        }
        setCartItems([])
        setTotalPrice(0)
        setTotalQuantities(0)
        router.push("/checkout/success")
    }

    async function sendOrderData(order) {
        console.log("in here")
        const response = await fetch("/api/order", {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json",
            },
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong")
        }
    }

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove,
                formData,
                handleChange,
                shipping,
                orderNumber,
                submitHandler,
                requestStatus,
                setTotalPrice,
                setTotalQuantities,
                setCartItems,
                shopDropDown,
                setShopDropDown,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)
