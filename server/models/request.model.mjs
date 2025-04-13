import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  // Reference to the requested item
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: [true, "Listing reference is required"],
  },

  // Department making the request
  department: {
    type: String,
    required: [true, "Department name is required"],
    enum: [
      "Emergency",
      "Surgery",
      "ICU",
      "Pediatrics",
      "Laboratory",
      "Pharmacy",
      "General Ward",
      "OB-GYN",
    ],
  },

  // Person requesting
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Requester reference is required"],
  },

  // Quantity requested
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },

  // Priority level
  priority: {
    type: String,
    required: [true, "Priority level is required"],
    enum: ["urgent", "high", "medium", "low"],
    default: "medium",
  },

  // Purpose of request
  purpose: {
    type: String,
    required: [true, "Purpose is required"],
  },

  // Request status
  status: {
    type: String, 
    default: "pending",
  },

  // Stock batches used to fulfill this request
  stocksUsed: [
    {
      stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ListingStocks",
      },
      quantity: Number,
    },
  ],

  // Approval details
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  approvalDate: Date,

  // Fulfillment details
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fulfillmentDate: Date,

  // Request notes/comments
  notes: {
    type: String,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for better query performance
requestSchema.index({ department: 1, status: 1 });
requestSchema.index({ createdAt: -1 });
requestSchema.index({ listing: 1, status: 1 });

// Update timestamp before saving
requestSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Middleware to handle stock deduction when request is fulfilled
requestSchema.pre("save", async function (next) {
  if (this.isModified("status") && this.status === "fulfilled") {
    const ListingStocks = mongoose.model("ListingStocks");

    // Update each stock batch used
    for (const stock of this.stocksUsed) {
      await ListingStocks.findByIdAndUpdate(
        stock.stockId,
        {
          $inc: { quantity: -stock.quantity },
          updatedAt: new Date(),
        },
        { new: true }
      );
    }
  }
  next();
});

export const Request = mongoose.model("Request", requestSchema);
