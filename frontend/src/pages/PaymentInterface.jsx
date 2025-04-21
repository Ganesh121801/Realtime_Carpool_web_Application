import React from 'react'
import '../styles/Products.css';
const PaymentInterface = () => {
  return (
    <div className='products-container'>
        <div className='product-card'>
            <img src="./images/bag.jpg" alt="Product" className='product-image' />
            <h3 className="product-title">Product Title</h3>
            <p className="product-price">price <strong>200</strong></p>
            <button className='pay-button'>Pay(200)/-</button>
        </div>
    </div>
  )
}

export default PaymentInterface