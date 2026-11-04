import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Category from "../models/Category.js";

// Default Categories
const categories = [
  {
    name: "Electronics",
    icon: "fa-solid fa-laptop",
    status: "active",
  },
  {
    name: "Mobile Phones",
    icon: "fa-solid fa-mobile-screen",
    status: "active",
  },
  {
    name: "Computers",
    icon: "fa-solid fa-computer",
    status: "active",
  },
  {
    name: "Accessories",
    icon: "fa-solid fa-headphones",
    status: "active",
  },
  {
    name: "Gaming",
    icon: "fa-solid fa-gamepad",
    status: "active",
  },
  {
    name: "Home Appliances",
    icon: "fa-solid fa-blender",
    status: "active",
  },
  {
    name: "Smart Watches",
    icon: "fa-solid fa-clock",
    status: "active",
  },
  {
    name: "Cameras",
    icon: "fa-solid fa-camera",
    status: "active",
  },
];

// Run Seeder
const seedCategories = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    console.log("Starting Category Seeder...");

    // Insert or update categories without duplicates
    const operations = categories.map((category) => ({
      updateOne: {
        filter: {
          name: category.name,
        },
        update: {
          $set: category,
        },
        upsert: true,
      },
    }));

    const result = await Category.bulkWrite(operations);

    console.log("Category Seeder Completed!");

    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Updated: ${result.modifiedCount}`);
    console.log(`Total Categories: ${await Category.countDocuments()}`);
  } catch (error) {
    console.error("Category Seeder Failed:", error.message);

    process.exitCode = 1;
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();

    console.log("MongoDB Connection Closed.");
  }
};

// Execute Seeder
seedCategories();
