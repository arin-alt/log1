import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Recipient is required"],
  },
  title: {
    type: String,
    required: [true, "Notification title is required"],
  },
  message: {
    type: String,
    required: [true, "Notification message is required"],
  },
  type: {
    type: String,
    enum: ["request", "stock", "system", "alert"],
    required: [true, "Notification type is required"],
  },
  reference: {
    model: {
      type: String,
      enum: ["Request", "Listing", "ListingStocks"],
      required: false,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "reference.model",
      required: false,
    },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
 
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);