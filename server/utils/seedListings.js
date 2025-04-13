import { Listing } from "../models/listing.model.js";
import { connectDB } from "../db/connectDB.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Read JSON file
    const inventoryData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../item_listing_v1.json"),
        "utf-8"
      )
    );

    // Transform data with proper date handling
    const listings = inventoryData.map(item => ({
      itemCode: item.item_id,
      title: item.item_name,
      description: item.description,
      category: item.item_type,
      abcCategory: "C",
      minStockLevel: item.min_required,
      maxStockLevel: item.max_capacity,
      status: item.status?.toLowerCase() || 'active',
      createdBy: item.created_by,
      createdAt: item.date ? new Date(item.date) : new Date() // Add fallback date
    }));

    // Clean existing data
    console.log("Cleaning existing data...");
    await Listing.deleteMany({});

    // Insert new data
    console.log("Inserting new data...");
    await Listing.insertMany(listings);

    console.log("Data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();