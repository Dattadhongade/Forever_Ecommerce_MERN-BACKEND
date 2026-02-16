import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ============== Add Product function =================== //
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    //Validate required fields
    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const numericPrice = Number(price);

    if (isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        message: "Invalid price value",
      });
    }

    //  image extraction
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    //  Upload to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      price: numericPrice,
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      bestSeller: bestSeller === "true",
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============  Product list (get) function =================== //
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    res.status(500).send("Internal server error ");
  }
};

// ==============  function for removing product =================== //
const removeProduct = async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }
    product = await productModel.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Product hass been deleted.",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    res.status(500).send("Internal server error ");
  }
};

// ==============  function for get single product info =================== //
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      message: "Product Found. ",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    res.status(500).send("Internal server error ");
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
