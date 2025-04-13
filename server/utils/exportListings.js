import { Listing } from "../models/listing.model.js";
import { connectDB } from "../db/connectDB.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const exportListings = async () => {
  try {
    await connectDB();
    
    const listings = await Listing.find().lean();

    const exportData = listings.map(listing => ({
      _id: listing._id,
      itemCode: listing.itemCode,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      abcCategory: listing.abcCategory,
      minStockLevel: listing.minStockLevel,
      maxStockLevel: listing.maxStockLevel,
      createdBy: listing.createdBy,
      status: listing.status,
      createdAt: listing.createdAt
    }));

    fs.writeFileSync(
      path.join(__dirname, "../exported_listings.json"),
      JSON.stringify(exportData, null, 2),
      'utf-8'
    );

    console.log("Listings exported successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error exporting listings:", error);
    process.exit(1);
  }
};

exportListings();