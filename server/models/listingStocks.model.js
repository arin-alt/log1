import mongoose from "mongoose";

const listingStocksSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: [true, "Listing reference is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
  unitCost: {
    type: Number,
    default: 0,
  },
  acquisitionDate: {
    type: Date,
    required: [true, "Acquisition date is required"],
    default: Date.now,
  },
  expirationDate: {
    type: Date,
  },
  avgUsagePerDay: {
    type: Number,
    default: 0,
  },
  supplier: {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
    },
    contactPerson: String,
    contactNumber: String,
    email: String,
  },
  manufacturer: {
    type: String,
    required: [true, "Manufacturer name is required"],
  },
  status: {
    type: String,
    enum: [
      "available",
      "reserved",
      "dispensed",
      "expired",
      "damaged",
      "recalled",
    ],
    default: "available",
  },
  storageLocation: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isNewOrder: {
    type: Boolean,
    default: true,
  },
});

listingStocksSchema.index({ listing: 1, acquisitionDate: -1 });

listingStocksSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const ListingStocks = mongoose.model(
  "ListingStocks",
  listingStocksSchema
);
