const Request = require("../../models/RequestInfo/request.model");
const Customer = require("../../models/CustomerInfo/Customer.model");

const RequestController = {
  // Create Request
  CreateRequest: async (req, res) => {
    try {
      const newRequest = new Request(req.body);
      // Check cusID
      const CheckCusID = await Customer.findOne({ cus_ID: req.body.Cus_ID });
      if (!CheckCusID) {
        return res.status(400).json({ message: "ID khách hàng không tồn tại" });
      }

      await newRequest.save();
      return res.status(200).json(newRequest);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  // Get create
  getAllRequest: async (req, res) => {
    try {
      const requests = await Request.find();
      if (!requests) {
        return res.status(400).json({ message: "Không có request nào" });
      }
      return res.status(200).json(requests);
    } catch (error) {}
  },

  getRequestByCusID: async (req, res) => {
    try {
      const { id } = req.params;
      const requests = await Request.find({ Cus_ID: id });
      console.log(requests);
      if (!requests || requests.length === 0) {
        return res.status(200).json({ message: "Chưa có yêu cầu nào!" });
      }
      return res.status(200).json(requests);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = RequestController;
