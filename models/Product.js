import mongoose from "mongoose";
import slugify from "slugify";

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: false,
    },

    image: {
      type: String,
      required: false,
    },

    price: {
      type: Number,
      required: true,
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    condition: {
      type: String,
      required: false,
    },

    features: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Automatically generate slug from product name
productSchema.pre("validate", function () {
  if (this.isModified("name") && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

// Create Product Model
const Product = mongoose.model("Product", productSchema);

export default Product;
