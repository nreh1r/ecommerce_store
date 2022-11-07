import React from "react"
import Link from "next/link"
import { AiOutlineShopping } from "react-icons/ai"

import { Cart } from "./"
import { useStateContext } from "../context/StateContext"

const Navbar = () => {
    const {
        showCart,
        setShowCart,
        totalQuantities,
        shopDropDown,
        setShopDropDown,
    } = useStateContext()
    return (
        <div className="navbar-container">
            <p className="logo">
                <Link href="/">Eheadphones</Link>
            </p>

            <nav className="navigation">
                <Link href="/shop">
                    <div className="shop-container">
                        <p
                            className="shop"
                            onPointerEnter={() => setShopDropDown(true)}
                            onPointerLeave={() => setShopDropDown(false)}
                        >
                            Shop <span className="arrow">v</span>
                        </p>
                        {shopDropDown && (
                            <div
                                className="shop-dropdown"
                                onPointerEnter={() => setShopDropDown(true)}
                                onPointerLeave={() => setShopDropDown(false)}
                            >
                                <Link href="/shop/headphones">
                                    <p className="dropdown">Head Phones</p>
                                </Link>
                                <Link href="/shop/watches">
                                    <p className="dropdown">Watches</p>
                                </Link>
                                <Link href="/shop/speakers">
                                    <p className="dropdown">Speakers</p>
                                </Link>
                            </div>
                        )}
                    </div>
                </Link>
                <Link href="/about">
                    <p className="dropdown">About</p>
                </Link>
                <Link href="/contact">
                    <p className="dropdown">Contact</p>
                </Link>
            </nav>

            <button
                type="button"
                className="cart-icon"
                onClick={() => setShowCart(true)}
            >
                <AiOutlineShopping />
                <span className="cart-item-qty">{totalQuantities}</span>
            </button>

            {showCart && <Cart />}
        </div>
    )
}

export default Navbar
