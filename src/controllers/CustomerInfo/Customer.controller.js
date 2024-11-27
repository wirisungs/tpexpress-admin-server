const Customer = require("../../models/CustomerInfo/Customer.model");
const Employee = require("../../models/UserInfo/Employee.model");
const User = require("../../models/UserInfo/User.model");

const genarateCusID = async () => {
  let id;
  let isUnique = false;

  while (!isUnique) {
    const randomParts = Math.floor(10000000 + Math.random() * 90000000);
    id = `KH${randomParts}`;

    // Kiểm tra tồn tại
    const existingCustomer = await Customer.findOne({ cusId: id });
    if (!existingCustomer) {
      isUnique = true;
    }
  }

  return id;
};

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

  // Create customer
  createCustomer: async (req, res) => {
    try {
      const customerID = await genarateCusID();
      console.log(customerID);
      const newCustomer = new Customer({ cusId: customerID, ...req.body });

      // Check email
      const existingEmail = await Customer.findOne({
        cusEmail: newCustomer.cusEmail,
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email đã tồn tại!" });
      }

      // Check phonenumber
      const existingPhoneNumber = await Customer.findOne({
        cusPhone: newCustomer.cusPhone,
      });
      if (existingPhoneNumber) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại!" });
      }

      // Check gender
      // console.log(newCustomer.cus_Gender < 0 || newCustomer.cus_Gender > 1);
      if (newCustomer.cusGender < 0 || newCustomer.cusGender > 1) {
        return res.status(400).json({ message: "Mã giới tính không hợp lệ!" });
      }
      await newCustomer.save();
      return res.status(200).json(newCustomer);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  // Get a customer with query
  getACustomerWithQuery: async (req, res) => {
    try {
      const { id, email, phone } = req.query;

      if (!id && !email && !phone) {
        return res.status(400).json({ message: "Khách hàng không tồn tại!" });
      }

      let searchCondition = {};
      if (id) {
        searchCondition = { cusId: id.trim() };
      } else if (email) {
        searchCondition = { cusEmail: email.trim() };
      } else if (phone) {
        searchCondition = { cusPhone: phone.trim() };
      }
      const customer = await Customer.findOne(searchCondition);
      if (!customer) {
        return res.status(404).json({
          message: "Khách hàng không tồn tại!",
          search: searchCondition,
        });
      }
      return res.status(200).json(customer);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  // Update customer details
  updateACustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;

      const customer = await Customer.findOne({ cusId: id });
      if (!customer) {
        return res.status(400).json({ message: "Khách hàng không tồn tại!" });
      }
      const updateData = {};
      for (const key in updateFields) {
        // Chỉ cập nhật các trường có giá trị khác với giá trị hiện tại
        if (
          (customer[key] === null || customer[key] !== updateFields[key]) &&
          updateFields[key] !== undefined &&
          updateFields[key] !== ""
        ) {
          updateData[key] = updateFields[key];
        }
      }
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ message: "Không có trường nào cập nhật" });
      }

      const updatedCustomer = await Customer.findOneAndUpdate(
        { cusId: id },
        updateData,
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Cập nhật thành công!", data: updatedCustomer });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = CustomerController;
