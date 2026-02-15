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
    //   get the images
    const image2 = req.files.image2 && req.files.image2[0];
    const image1 = req.files.image1 && req.files.image1[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };
    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    res.status(500).send("Internal server error ");
  }
};

// ==============  Product list (get) function =================== //
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
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
      message: "Product hass been deleted",
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
