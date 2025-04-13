import { Listing } from "../models/listing.model.js";
import { createNotification } from "./notification.controller.js";

export const createListing = async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      createdBy: req.userId,
    });
    await listing.save();
    res.status(201).json({ success: true, listing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    const populatedListings = await Promise.all(
      listings.map(async (listing) => {
        const calculatedFields = await listing.getCalculatedFields();

        if (calculatedFields.stockLevelStatus === "low") {
          await createNotification({
            recipient: listing.createdBy,
            title: "Low Stock Alert",
            message: `${listing.title} is running low on stock. Current stock: ${calculatedFields.currentStock}`,
            type: "stock",
            reference: {
              model: "Listing",
              id: listing._id,
            },
          });
        }

        return {
          ...listing.toObject(),
          ...calculatedFields,
        };
      })
    );
    res.json({ success: true, listings: populatedListings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .lean({ virtuals: true });
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }
    res.status(200).json({ success: true, listing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }
    res.status(200).json({ success: true, listing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
