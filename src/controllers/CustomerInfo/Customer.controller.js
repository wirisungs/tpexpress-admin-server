const Customer = require("../../models/CustomerInfo/Customer.model");

const CustomerController = {
  // Get all customers
  getAllCustomers: async (req, res) => {
    try {
      const customers = await Customer.find();
      if (!customers) {
        return res.status(400).json({ message: "Không có khách hàng nào" });
      }
      return res.status(200).json(customers);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = CustomerController;
