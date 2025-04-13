import { ListingStocks } from "../models/listingStocks.model.js";
import { Listing } from "../models/listing.model.js";

export const createStock = async (req, res) => {
  try {
    const listing = await Listing.findById(req.body.listing);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (req.body.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const currentStock = await listing.currentStock;
    const newTotal = currentStock + req.body.quantity;

    if (newTotal < listing.minStockLevel) {
      return res.status(400).json({
        success: false,
        message: `Cannot add stock. Total quantity (${newTotal}) would be below minimum stock level (${listing.minStockLevel})`,
      });
    }

    if (newTotal > listing.maxStockLevel) {
      return res.status(400).json({
        success: false,
        message: `Cannot add stock. Total quantity (${newTotal}) would exceed maximum stock level (${listing.maxStockLevel})`,
      });
    }

    const stock = new ListingStocks(req.body);
    await stock.save();

    await listing.updateStockFields();

    res.status(201).json({ success: true, stock });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStocks = async (req, res) => {
  try {
    const stocks = await ListingStocks.find()
      .populate("listing", "itemCode title _id")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, stocks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStock = async (req, res) => {
  try {
    const stock = await ListingStocks.findById(req.params.id).populate(
      "listing",
      "itemCode title"
    );
    if (!stock) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }
    res.status(200).json({ success: true, stock });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const existingStock = await ListingStocks.findById(req.params.id);
    if (!existingStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    if (req.body.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const listing = await Listing.findById(existingStock.listing);
    const currentStock = await listing.currentStock;
    const stockDifference = req.body.quantity - existingStock.quantity;
    const newTotal = currentStock + stockDifference;

    if (newTotal < listing.minStockLevel) {
      return res.status(400).json({
        success: false,
        message: `Cannot update stock. Total quantity (${newTotal}) would be below minimum stock level (${listing.minStockLevel})`,
      });
    }

    if (newTotal > listing.maxStockLevel) {
      return res.status(400).json({
        success: false,
        message: `Cannot update stock. Total quantity (${newTotal}) would exceed maximum stock level (${listing.maxStockLevel})`,
      });
    }

    const stock = await ListingStocks.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await listing.updateStockFields();

    res.status(200).json({ success: true, stock });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const stock = await ListingStocks.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }

    // Update ABC category after new stock is added
    const listing = await Listing.findById(stock.listing);
    await listing.updateStockFields();

    res
      .status(200)
      .json({ success: true, message: "Stock deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
