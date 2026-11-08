import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import AdminUser from "../models/AdminUser.js";

// 3 Default Admin Users (Raw passwords before hashing)
const adminUsers = [
  {
    name: "Super Admin",
    email: "admin@cartivo.com",
    password: "admin123",
    role: "superadmin",
    status: "active",
  },
  {
    name: "Sarah Jenkins",
    email: "manager@cartivo.com",
    password: "manager123",
    role: "admin",
    status: "active",
  },
  {
    name: "Alex Morgan",
    email: "alex@cartivo.com",
    password: "alex123",
    role: "manager",
    status: "active",
  },
];

// Run Admin User Seeder with Password Hashing
const seedAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Starting Admin User Seeder with password hashing...");

    // Prepare bulk operations with hashed passwords
    const operations = await Promise.all(
      adminUsers.map(async (user) => {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        return {
          updateOne: {
            filter: {
              email: user.email,
            },
            update: {
              $set: {
                ...user,
                password: hashedPassword,
              },
            },
            upsert: true,
          },
        };
      })
    );

    // Bulk write users (idempotent upsert)
    const result = await AdminUser.bulkWrite(operations);

    console.log("Admin User Seeder Completed Successfully!");
    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Updated: ${result.modifiedCount}`);
    console.log(`Matched: ${result.matchedCount}`);
    console.log(`Total Admin Users: ${await AdminUser.countDocuments()}`);
  } catch (error) {
    console.error("Admin User Seeder Failed:", error.message);
    process.exitCode = 1;
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("MongoDB Connection Closed.");
  }
};

// Execute Seeder
seedAdminUsers();
