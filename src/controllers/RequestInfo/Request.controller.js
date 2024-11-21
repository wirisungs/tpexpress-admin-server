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
      const requests = await Request.aggregate([
        {
          $lookup: {
            from: "Customer",
            localField: "Cus_ID",
            foreignField: "cusId",
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
          },
        },
        {
          $project: {
            Request_ID: 1,
            Cus_ID: 1,
            Order_ID: 1,
            Driver_ID: 1,
            Request_Picture: 1,
            Request_Status: 1,
            Request_Date: 1,
            Request_Type: 1,
            customer: 1,
          },
        },
      ]);
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

  updateRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { Request_Status } = req.body;

      const request = await Request.findOne({ Request_ID: id });

      if (!request) {
        return res.status(404).json({ message: "Yêu cầu không tồn tại" });
      }

      request.Request_Status = Request_Status;

      await request.save();

      res.status(200).json({ message: "Cập nhật trang thành thành công!" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = RequestController;
