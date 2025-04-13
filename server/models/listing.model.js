import mongoose from "mongoose";
import { ListingStocks } from "./listingStocks.model.js";

const listingSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: [true, "Item code is required"],
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    abcCategory: {
      type: String,
      required: [true, "ABC category is required"],
      default: "C",
      enum: ["A", "B", "C"],
    },
    minStockLevel: {
      type: Number,
      required: [true, "Minimum stock level is required"],
      min: 0,
    },
    maxStockLevel: {
      type: Number,
      required: [true, "Maximum stock level is required"],
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "discontinued", "out-of-stock"],
      default: "active",
    },
    lastABCUpdate: {
      type: Date,
      default: Date.now,
    },
    totalStocks: {
      type: Number,
      default: 0,
    },
    stockLevelStatus: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "low",
    },
    stockLevelPercentage: {
      type: Number,
      default: 0,
    },
    lastStockUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// pre-save middleware to update stock fields
listingSchema.pre("save", async function (next) {
  try {
    const currentStock = await this.currentStock;
    this.totalStocks = currentStock;

    const threshold = (this.maxStockLevel - this.minStockLevel) / 3;

    // Update stock level status
    if (currentStock <= this.minStockLevel + threshold) {
      this.stockLevelStatus = "low";
    } else if (currentStock <= this.maxStockLevel - threshold) {
      this.stockLevelStatus = "moderate";
    } else {
      this.stockLevelStatus = "high";
    }

    // Calculate percentage
    const range = this.maxStockLevel - this.minStockLevel;
    const stockAboveMin = currentStock - this.minStockLevel;
    this.stockLevelPercentage =
      range <= 0
        ? 0
        : Math.min(Math.max(0, (stockAboveMin / range) * 100), 100);

    this.lastStockUpdate = new Date();
    next();
  } catch (error) {
    next(error);
  }
});
listingSchema.methods.getCalculatedFields = async function () {
  const currentStock = await this.currentStock;
  const stockLevel = await this.stockLevel;

  return {
    currentStock,
    stockLevel,
    totalStocks: currentStock,
    stockLevelStatus: this.stockLevelStatus,
    stockLevelPercentage: this.stockLevelPercentage,
  };
};

// method to update stock fields
listingSchema.methods.updateStockFields = async function () {
  await this.save();
};

// current stock level
listingSchema.virtual("currentStock").get(async function () {
  const stocks = await ListingStocks.aggregate([
    { $match: { listing: this._id, status: "available" } },
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);
  return stocks.length > 0 ? stocks[0].total : 0;
});

// stock level status
listingSchema.virtual("stockLevel").get(async function () {
  const currentStock = await this.currentStock;
  const threshold = (this.maxStockLevel - this.minStockLevel) / 3;

  if (currentStock <= this.minStockLevel + threshold) {
    return "low";
  } else if (currentStock <= this.minStockLevel + threshold * 2) {
    return "moderate";
  } else {
    return "high";
  }
});

// method to calculate abc category based on stock movement
listingSchema.methods.calculateABCCategory = async function () {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // get stock movement data for the last 6 months
  const stockMovements = await ListingStocks.find({
    listing: this._id,
    createdAt: { $gte: sixMonthsAgo },
  });

  // calculate restock frequency
  const restockCount = stockMovements.length;

  // calculate total quantity moved
  const totalQuantityMoved = stockMovements.reduce(
    (sum, stock) => sum + stock.quantity,
    0
  );

  // determine abc category based on movement metrics
  let newCategory;
  if (restockCount >= 6 && totalQuantityMoved > 1000) {
    newCategory = "A"; // high movement items
  } else if (restockCount >= 3 && totalQuantityMoved > 500) {
    newCategory = "B"; // moderate movement items
  } else {
    newCategory = "C"; // low movement items
  }

  // update the category
  if (this.abcCategory !== newCategory) {
    this.abcCategory = newCategory;
    this.lastABCUpdate = new Date();
    await this.save();
  }

  return newCategory;
};

// pre-save middleware to update abc category
listingSchema.pre("save", async function (next) {
  if (
    !this.isNew &&
    Date.now() - this.lastABCUpdate > 30 * 24 * 60 * 60 * 1000
  ) {
    // update abc category if its been more than 30 days
    await this.calculateABCCategory();
  }
  next();
});

export const Listing = mongoose.model("Listing", listingSchema);
