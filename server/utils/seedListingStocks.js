import { ListingStocks } from "../models/listingStocks.model.js";
import { Listing } from "../models/listing.model.js";
import { connectDB } from "../db/connectDB.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedStocksDatabase = async () => {
  try {
    await connectDB();

    // Get all listings to reference
    const listings = await Listing.find().lean();

    // Read JSON file
    const stocksData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../stock_listing_v1_1.json"),
        "utf-8"
      )
    );

    // Transform data with validation checks
    const stocks = stocksData
      .map((stock) => {
        const listingRef = listings.find(
          (l) => l.itemCode === stock.item_code
        )?._id;
        if (!listingRef) {
          console.warn(`No listing found for item code: ${stock.item_code}`);
        }

        return {
          listing: listingRef,
          quantity: stock.quantity || 0,
          serialNumber: stock.serial_number || `SN-${Date.now()}`,
          acquisitionDate: stock.acquisition_date
            ? new Date(stock.acquisition_date)
            : new Date(),
          expirationDate: stock.expiration_date
            ? new Date(stock.expiration_date)
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          supplier: {
            name: stock.supplier_name || "Default Supplier",
            contactPerson: stock.supplier_contact || "Contact Person",
            contactNumber: stock.supplier_phone || "N/A",
            email: stock.supplier_email || "supplier@example.com",
          },
          manufacturer: stock.manufacturer || "Default Manufacturer",
          unitCost: stock.unit_cost || 0,
          status: stock.status?.toLowerCase() || "available",
          storageLocation: stock.storage_location || "Main Storage",
        };
      })
      .filter((stock) => stock.listing); // Only include stocks with valid listing references

    // Clean existing data
    console.log("Cleaning existing stocks data...");
    await ListingStocks.deleteMany({});

    // Insert new data
    console.log("Inserting new stocks data...");
    await ListingStocks.insertMany(stocks);

    console.log("Stocks data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding stocks data:", error);
    process.exit(1);
  }
};

seedStocksDatabase();
