const Order = require("../../models/OrderInfo/Order.model");

const OrderController = {
  // Get all order
  getAllOrder: async (req, res) => {
    try {
      const orders = await Order.find();
      if (!orders) {
        return res.status(400).json({ Message: "Không có đơn hàng nào!" });
      }
      res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error.Message);
    }
  },
};

module.exports = OrderController;
