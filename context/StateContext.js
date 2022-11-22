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

    const onAdd = (product, quantity, chosenOption) => {
        const new_item = {
            ...product,
            chosenOption,
            price: chosenOption.price,
        }
        console.log("In the add item")
        console.log(new_item.chosenOption.option)
        const checkProducInCart = cartItems.find((item) => {
            console.log(item)
            return (
                item._id === new_item._id &&
                item.chosenOption.option === new_item.chosenOption.option
            )
        })

        setTotalPrice((prevTotalPrice) => {
            return prevTotalPrice + parseInt(chosenOption.price) * quantity
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
            new_item.quantity = quantity

            setCartItems([...cartItems, { ...new_item }])
        }

        toast.success(`${qty} ${new_item.name} added to the cart`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find(
            (item) =>
                item._id === product._id &&
                item.chosenOption.option === product.chosenOption.option
        )
        console.log(foundProduct)
        const newCartItems = cartItems.filter(
            (item) => item.chosenOption._key !== product.chosenOption._key
        )
        console.log(newCartItems)
        setTotalPrice(
            (prevTotalPrice) =>
                prevTotalPrice -
                foundProduct.chosenOption.price * foundProduct.quantity
        )
        setTotalQuantities(
            (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
        )
        setCartItems(newCartItems)
    }

    const toggleCartItemQuantity = (id, value, key) => {
        foundProduct = cartItems.find(
            (item) => item._id === id && item.chosenOption._key === key
        )
        index = cartItems.findIndex(
            (product) => product._id === id && product.chosenOption._key === key
        )

        const newCartItems = cartItems.filter(
            (item) => item.chosenOption._key !== key
        )

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

        const orderItems = {
            cartItems,
        }

        try {
            await sendStockData(orderItems)
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
        router.push("/checkout/Success")
    }

    async function sendOrderData(order) {
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

    async function sendStockData(order) {
        const response = await fetch("/api/stock", {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json",
            },
        })
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
