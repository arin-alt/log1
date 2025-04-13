import { Request } from "../models/request.model.mjs";
import { ListingStocks } from "../models/listingStocks.model.js";
import { createNotification } from "../controllers/notification.controller.js";

export const createRequest = async (req, res) => {
  try {
    const request = new Request({
      ...req.body,
      requestedBy: req.userId,
      status: "pending",
    });
    await request.save();
    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("listing", "itemCode title")
      .populate("requestedBy", "firstName lastName")
      .populate("approvedBy", "firstName lastName")
      .populate("fulfilledBy", "firstName lastName")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("listing", "itemCode title")
      .populate("requestedBy", "firstName lastName")
      .populate("approvedBy", "firstName lastName")
      .populate("fulfilledBy", "firstName lastName")
      .populate("stocksUsed.stockId");

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request can only be approved when pending",
      });
    }

    request.status = "approved";
    request.approvedBy = req.userId;
    request.approvalDate = Date.now();
    await request.save();

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const fulfillRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("listing");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Request must be approved before fulfillment",
      });
    }

    // find available stocks for this listing
    const availableStocks = await ListingStocks.find({
      listing: request.listing._id,
      status: "available",
      quantity: { $gt: 0 },
    }).sort({ expirationDate: 1 });

    let remainingQuantity = request.quantity;
    const stocksToUse = [];

    // allocate stocks based on FEFO
    for (const stock of availableStocks) {
      if (remainingQuantity <= 0) break;

      const quantityFromStock = Math.min(stock.quantity, remainingQuantity);
      stocksToUse.push({
        stockId: stock._id,
        quantity: quantityFromStock,
      });

      remainingQuantity -= quantityFromStock;
    }

    if (remainingQuantity > 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available to fulfill request",
      });
    }

    // update request with selected stocks
    request.status = "fulfilled";
    request.fulfilledBy = req.userId;
    request.fulfillmentDate = Date.now();
    request.stocksUsed = stocksToUse;
    await request.save();

    // create notification
    await createNotification({
      recipient: request.requestedBy,
      title: "Request Fulfilled",
      message: `Your request for ${request.listing.title} has been fulfilled`,
      type: "request",
      reference: {
        model: "Request",
        id: request._id,
      },
    });

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be rejected",
      });
    }

    request.status = "rejected";
    request.notes = req.body.notes || "Request rejected";
    await request.save();

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (!["pending", "approved"].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: "Only pending or approved requests can be cancelled",
      });
    }

    request.status = "cancelled";
    request.notes = req.body.notes || "Request cancelled";
    await request.save();

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
