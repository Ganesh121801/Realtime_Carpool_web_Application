const instance = require('../razorpay.js');
const crypto = require('crypto');
module.exports.processPayment = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount*100), 
            currency: "INR",
           
        };

        const order = await instance.orders.create(options);
        console.log("Order:", order);
        
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({
            success: false,
            message: "Error processing payment",
            error: error.message
        });
    }
}


module.exports.getKey = async (req, res) => { 
    res.status(200).json({
        key : process.env.RAZORPAY_API_KEY
    })
}

module.exports.paymentVerification = async (req, res) => {
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if(isAuthentic) {
        res.status(200).json({
            success: true,
            payment_id: razorpay_payment_id
        });
    } else {
        res.status(400).json({
            success: false
        });
    }
}