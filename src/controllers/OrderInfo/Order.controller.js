const Order = require("../../models/OrderInfo/Order.model");
const Customer = require("../../models/CustomerInfo/Customer.model");
const DServices = require("../../models/OrderInfo/DService.model");
const moment = require("moment");

// Hàm random ID mã Order
function generateOrderID(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let orderId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    orderId += chars[randomIndex];
  }
  return orderId;
}

Date.prototype.GetFirstDayOfWeek = function () {
  this.setHours(0, 0, 0, 0);
  return new Date(
    this.setDate(this.getDate() - this.getDay() + (this.getDay() == 0 ? -6 : 1))
  );
};
Date.prototype.GetLastDayOfWeek = function () {
  this.setHours(0, 0, 0, 0);
  return new Date(this.setDate(this.getDate() - this.getDay() + 7));
};

// OrderController
const OrderController = {
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.aggregate([
        // Link với bảng khách hàng
        {
          $lookup: {
            from: "Customer", // Tên collection
            localField: "cusId", // ID trong order
            foreignField: "cusId", // ID trong customer
            as: "customerDetails", // Tên field chứa kết quả join
          },
        },
        // Link với bảng tài xế
        {
          $lookup: {
            from: "Driver",
            localField: "driverId",
            foreignField: "driverId",
            as: "driverDetails",
          },
        },
        // Link với bảng trạng thái giao hàng
        {
          $lookup: {
            from: "DeliveryStatus",
            localField: "orderStatusId",
            foreignField: "statusId",
            as: "deliveryStatus",
          },
        },
        // Link với bảng dịch vụ giao hàng
        {
          $lookup: {
            from: "DeliveryServices",
            localField: "dservicesId",
            foreignField: "dservicesId",
            as: "deliveryServices",
          },
        },
        {
          $unwind: {
            path: "$customerDetails",
          },
        },
        {
          $unwind: {
            path: "$driverDetails",
            preserveNullAndEmptyArrays: true, // Giữ lại nếu không có kết quả
          },
        },
        {
          $unwind: {
            path: "$deliveryStatus",
          },
        },
        {
          $unwind: {
            path: "$deliveryServices",
          },
        },
        {
          $project: {
            statusId: 1,
            orderId: 1,
            paymentId: 1,
            orderIsFragile: 1,
            orderNote: 1,
            orderCOD: 1,
            deliverPrice: 1,
            orderType: 1,
            orderDate: 1,
            receiverName: 1,
            receiverAddress: 1,
            receiverPhone: 1,
            proofSuccess: 1,
            reasonFailed: 1,
            customerDetails: 1, // Lấy thông tin từ customer
            createdDate: 1,
            driverDetails: {
              $cond: {
                if: { $eq: ["$driverDetails", []] },
                then: {},
                else: "$driverDetails",
              },
            }, // Kiểm tra nếu driverDetails là mảng rỗng, thì trả về đối tượng rỗng
            deliveryStatus: 1, // Lấy thông tin từ delivery status
            deliveryServices: 1, // Lấy thông tin từ delivery services
          },
        },
      ]);

      if (orders.length === 0) {
        return res.status(400).json("Không có dữ liệu");
      }

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOrderByCusId: async (req, res) => {
    try {
      const { id } = req.params;

      const orders = await Order.aggregate([
        {
          $match: { cusId: id },
        },
        // Link với bảng khách hàng
        {
          $lookup: {
            from: "Customer",
            localField: "cusId",
            foreignField: "cusId",
            as: "customerDetails",
          },
        },
        // Link với bảng tài xế
        {
          $lookup: {
            from: "Driver",
            localField: "driverId",
            foreignField: "driverId",
            as: "driverDetails",
          },
        },
        // Link với bảng trạng thái giao hàng
        {
          $lookup: {
            from: "DeliveryStatus",
            localField: "orderStatusId",
            foreignField: "statusId",
            as: "deliveryStatus",
          },
        },

        // Link với bảng dịch vụ giao hàng
        {
          $lookup: {
            from: "DeliveryServices",
            localField: "dservicesId",
            foreignField: "dservicesId",
            as: "deliveryServices",
          },
        },
        {
          $unwind: "$customerDetails", // Tách mảng kết quả join thành đối tượng
        },
        {
          $unwind: {
            path: "$driverDetails",
            preserveNullAndEmptyArrays: true, // Giữ lại nếu không có kết quả
          },
        },
        {
          $unwind: "$deliveryStatus", // Tách mảng kết quả join thành đối tượng
        },
        {
          $unwind: "$deliveryServices", // Tách mảng kết quả join thành đối tượng
        },

        {
          $project: {
            statusId: 1,
            orderId: 1,
            paymentId: 1,
            orderIsFragile: 1,
            orderNote: 1,
            orderCOD: 1,
            deliverPrice: 1,
            orderType: 1,
            orderDate: 1,
            receiverName: 1,
            receiverAddress: 1,
            receiverPhone: 1,
            proofSuccess: 1,
            reasonFailed: 1,
            customerDetails: 1, // Lấy thông tin từ customer
            createdDate: 1,
            driverDetails: {
              $cond: {
                if: { $eq: ["$driverDetails", []] },
                then: {},
                else: "$driverDetails",
              },
            }, // Kiểm tra nếu driverDetails là mảng rỗng, thì trả về đối tượng rỗng
            deliveryStatus: 1, // Lấy thông tin từ delivery status
            deliveryServices: 1, // Lấy thông tin từ delivery services
          },
        },
      ]);

      if (orders.length === 0) {
        return res
          .status(404)
          .json({ message: "Chưa có đơn hàng nào!", ec: "NotFound" }); //ec: 'errorCode'
      }

      res.status(200).json(orders); // Trả về đơn hàng đầu tiên nếu tìm thấy
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createOrder: async (req, res) => {
    try {
      const orderId = await generateOrderID();
      const order = new Order({ orderId: orderId, ...req.body });
      await order.save();
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  countOrderByStatus: async (req, res) => {
    try {
      const counts = await Order.aggregate([
        {
          $match: {
            orderStatusId: { $in: ["ST001", "ST003", "ST004", "ST002"] },
          },
        },
        {
          $group: {
            _id: "$orderStatusId",
            count: { $sum: 1 },
          },
        },
      ]);
      const result = {
        Pending: 0,
        Delivering: 0,
        Success: 0,
        Canceled: 0,
      };

      counts.forEach((item) => {
        if (item._id === "ST001") result.Pending = item.count;
        else if (item._id === "ST002") result.Delivering = item.count;
        else if (item._id === "ST003") result.Success = item.count;
        else if (item._id === "ST004") result.Canceled = item.count;
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  getOrdersInLast7Days: async (req, res) => {
    try {
      // Lấy ngày hiện tại và 7 ngày trước
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      console.log(sevenDaysAgo);
      sevenDaysAgo.setDate(today.getDate() - 6); // Lấy ngày 7 ngày trước

      // Truy vấn để lấy tổng tiền mỗi ngày trong 7 ngày gần nhất
      const result = await Order.aggregate([
        {
          // Lọc các đơn hàng có createdDate trong 7 ngày gần nhất
          $match: {
            createdDate: { $gte: sevenDaysAgo, $lte: today },
          },
        },
        {
          // Chuyển ngày thành định dạng ngày (loại bỏ giờ, phút, giây)
          $project: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdDate" },
            },
            deliverPrice: 1,
          },
        },
        {
          // Nhóm theo ngày và tính tổng tiền cho mỗi ngày
          $group: {
            _id: "$date",
            deliverPrice: { $sum: "$deliverPrice" },
          },
        },
        {
          // Sắp xếp theo ngày (từ mới nhất đến cũ nhất)
          $sort: { _id: -1 },
        },
        {
          // Giới hạn chỉ lấy 7 ngày gần nhất
          $limit: 7,
        },
      ]);

      // Tạo danh sách 7 ngày gần nhất
      const allDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + i);
        allDates.push(date.toISOString().split("T")[0]); // Chuyển thành định dạng YYYY-MM-DD
      }

      // Đảm bảo kết quả có đầy đủ ngày
      const completeResult = allDates.map((date) => {
        const found = result.find((r) => r._id === date);
        return {
          date,
          deliverPrice: found ? found.deliverPrice : 0, // Nếu không có, đặt deliverPrice là 0
        };
      });

      // Gửi kết quả về frontend
      res.status(200).json(completeResult);
    } catch (error) {
      res.status(500).json({ message: "Lỗi truy vấn: " + error.message });
    }
  },
  getRankingOfWeek: async (req, res) => {
    var today = new Date();
    console.log(today.GetFirstDayOfWeek(), today.GetLastDayOfWeek());
    try {
      const rankings = await Order.aggregate([
        {
          $match: {
            orderStatusId: "ST003", // Lọc các đơn hàng có trạng thái hoàn thành
            driverId: { $ne: null }, // Loại bỏ các đơn hàng không có tài xế
            createdDate: {
              $gte: today.GetFirstDayOfWeek(),
              $lte: today.GetLastDayOfWeek(),
            },
          },
        },
        {
          $group: {
            _id: "$driverId", // Nhóm theo driverId
            completedOrdersCount: { $sum: 1 }, // Tính tổng số đơn hàng hoàn thành cho mỗi tài xế
          },
        },
        {
          $sort: { completedOrdersCount: -1 }, // Sắp xếp giảm dần theo số lượng đơn hoàn thành
        },
        {
          $limit: 5, // Lấy 5 tài xế hàng đầu
        },
        {
          $lookup: {
            from: "Driver",
            localField: "_id",
            foreignField: "driverId",
            as: "driverDetails",
          },
        },
        {
          $unwind: "$driverDetails",
        },

        {
          $project: {
            driverName: "$driverDetails.driverName",
            completedOrdersCount: 1,
          },
        },
      ]);

      // Kiểm tra nếu không có kết quả
      if (!rankings || rankings.length === 0) {
        return res.status(400).json({ message: "Không có dữ liệu" });
      }

      res.status(200).json(rankings);
    } catch (error) {
      res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
  },
  getOrderDetails: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "Vui lòng nhập mã đơn hàng!" });
      }
      const order = await Order.aggregate([
        {
          $match: { orderId: id },
        },
        {
          $lookup: {
            from: "Customer",
            localField: "cusId",
            foreignField: "cusId",
            as: "customerDetails",
          },
        },
        {
          $lookup: {
            from: "Driver",
            localField: "driverId",
            foreignField: "driverId",
            as: "driverDetails",
          },
        },
        {
          $lookup: {
            from: "OrderDetail",
            localField: "orderId",
            foreignField: "Order_ID",
            as: "items",
          },
        },
        {
          $unwind: {
            path: "$customerDetails",
          },
        },
        {
          $unwind: {
            path: "$driverDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            orderId: 1,
            cusId: 1,
            senderAddress: 1,
            receiverPhone: 1,
            receiverName: 1,
            receiverAddress: 1,
            orderType: 1,
            orderIsFragile: 1,
            orderNote: 1,
            orderCOD: 1,
            dservicesId: 1,
            totalPrice: 1,
            paymentId: 1,
            orderStatusId: 1,
            driverId: 1,
            createdDate: 1,
            deliverPrice: 1,
            proofSuccess: 1,
            reasonFailed: 1,
            customerDetails: 1,
            driverDetails: 1,
            items: 1,
          },
        },
      ]);

      if (!order || order.length === 0) {
        return res.status(400).json({ message: "Đơn hàng không tồn tại!" });
      }
      res.status(200).json(order[0]);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

const DServiceController = {
  // Get all services
  getAllServices: async (req, res) => {
    try {
      const services = await DServices.find();
      if (!services || services.length === 0) {
        return res.status(200).json({ message: "Không có dịch vụ" });
      }
      return res.status(200).json(services);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = { OrderController, DServiceController };
