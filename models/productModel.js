import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: true,
  },
  description: {
    type: String,
    requires: true,
  },
  price: {
    type: Number,
    requires: true,
  },
  image: {
    type: Array,
    requires: true,
  },
  cateory: {
    type: String,
    requires: true,
  },
  subCategory: {
    type: String,
    requires: true,
  },
  sizes: {
    type: Array,
    requires: true,
  },
  bestseller: {
    type: Boolean,
    requires: true,
  },
  date: {
    type: Number,
    requires: true,
  },
});

const productModel =
  mongoose.models.product || mongoose.model("products", productSchema);

export default productModel;
