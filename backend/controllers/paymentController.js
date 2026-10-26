const Payment = require('../models/Payment');

exports.processPayment = async (req, res, next) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount,
      paymentMethod: paymentMethod || 'UPI',
      transactionId: `TXN-${Date.now()}`,
      status: 'success'
    });
    res.json({ success: true, data: payment });
  } catch (err) { next(err); }
};