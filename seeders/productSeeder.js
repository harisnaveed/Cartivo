import "dotenv/config";
import mongoose from "mongoose";
import slugify from "slugify";

import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Sample products
const products = [
  {
    name: "iPhone 15 Pro",
    description:
      "Apple iPhone 15 Pro with A17 Pro chip and advanced camera system.",
    price: 999,
    categoryName: "Mobile Phones",
    stock: 15,
    condition: "New",
    features: "A17 Pro Chip, 48MP Camera, 5G, Face ID",
    status: "active",
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    description:
      "Premium Samsung smartphone with an advanced AI-powered camera.",
    price: 1199,
    categoryName: "Mobile Phones",
    stock: 12,
    condition: "New",
    features: "Snapdragon Processor, 200MP Camera, 5G, S Pen",
    status: "active",
  },
  {
    name: "MacBook Pro M4",
    description: "Powerful Apple MacBook Pro for professional workflows.",
    price: 1599,
    categoryName: "Computers",
    stock: 8,
    condition: "New",
    features: "M4 Chip, 16GB RAM, 512GB SSD, Retina Display",
    status: "active",
  },
  {
    name: "Dell XPS 15",
    description: "Premium performance laptop with a stunning display.",
    price: 1399,
    categoryName: "Computers",
    stock: 6,
    condition: "New",
    features: "Intel Core i7, 16GB RAM, 1TB SSD, OLED Display",
    status: "active",
  },
  {
    name: "Apple Watch Series 10",
    description:
      "Smartwatch with fitness tracking and health monitoring features.",
    price: 399,
    categoryName: "Smart Watches",
    stock: 20,
    condition: "New",
    features: "Heart Rate Monitor, GPS, Sleep Tracking, Water Resistant",
    status: "active",
  },
  {
    name: "Sony WH-1000XM5",
    description:
      "Wireless noise-cancelling headphones with premium sound quality.",
    price: 349,
    categoryName: "Accessories",
    stock: 25,
    condition: "New",
    features: "Noise Cancellation, Bluetooth, 30-Hour Battery",
    status: "active",
  },
  {
    name: "PlayStation 5",
    description:
      "Sony PlayStation 5 gaming console with high-performance graphics.",
    price: 499,
    categoryName: "Gaming",
    stock: 10,
    condition: "New",
    features: "4K Gaming, Ray Tracing, 825GB SSD, DualSense Controller",
    status: "active",
  },
  {
    name: "Logitech G502 Hero",
    description: "High-performance gaming mouse with customizable controls.",
    price: 79,
    categoryName: "Accessories",
    stock: 30,
    condition: "New",
    features: "25K DPI Sensor, RGB Lighting, 11 Programmable Buttons",
    status: "active",
  },
  {
    name: "Canon EOS R50",
    description: "Mirrorless camera for photography and content creation.",
    price: 679,
    categoryName: "Cameras",
    stock: 7,
    condition: "New",
    features: "24.2MP Sensor, 4K Video, Autofocus, Wi-Fi",
    status: "active",
  },
  {
    name: "Samsung 55-inch Smart TV",
    description: "4K UHD smart television with a vibrant display.",
    price: 699,
    categoryName: "Home Appliances",
    stock: 5,
    condition: "New",
    features: "4K UHD, Smart TV, HDR, Wi-Fi",
    status: "active",
  },
];

// Generate slug
const generateSlug = (name) => {
  return slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });
};

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Connected to MongoDB...");

    // Get all required categories
    const categoryNames = [
      ...new Set(products.map((product) => product.categoryName)),
    ];

    const categories = await Category.find({
      name: { $in: categoryNames },
    });

    // Create category lookup
    const categoryMap = new Map(
      categories.map((category) => [category.name, category._id]),
    );

    // Check for missing categories
    const missingCategories = categoryNames.filter(
      (name) => !categoryMap.has(name),
    );

    if (missingCategories.length > 0) {
      throw new Error(
        `Missing categories: ${missingCategories.join(", ")}. Run your category seeder first.`,
      );
    }

    // Prepare product operations
    const operations = products.map((product) => {
      const { categoryName, ...productData } = product;

      const slug = generateSlug(product.name);

      return {
        updateOne: {
          filter: { slug },
          update: {
            $set: {
              ...productData,
              slug,
              category_id: categoryMap.get(categoryName),
            },
          },
          upsert: true,
        },
      };
    });

    // Insert or update products
    const result = await Product.bulkWrite(operations);

    console.log("Product seeding completed!");
    console.log("Inserted:", result.upsertedCount);
    console.log("Updated:", result.modifiedCount);
    console.log("Matched:", result.matchedCount);
  } catch (error) {
    console.error("Product Seeder Error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

seedProducts();
