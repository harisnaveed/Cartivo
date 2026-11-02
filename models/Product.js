
import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: false
        },

        image: {
            type: String,
            required: false
        },

        price: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        stock: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

// Create Product Model
const Product = mongoose.model("Product", productSchema);

export default Product;
