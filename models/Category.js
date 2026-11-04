import mongoose from "mongoose";
import slugify from "slugify";

// Category Schema
const categorySchema = new mongoose.Schema(
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

    icon: {
      type: String,
      required: true,
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

// Automatically generate slug from category name
categorySchema.pre("validate", function () {
  if (this.isModified("name") && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

// Create Category Model
const Category = mongoose.model("Category", categorySchema);

export default Category;
