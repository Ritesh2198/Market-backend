import {Product} from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary';


function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}


async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


export const createProduct = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        
        if (!req.files || !req.files.images) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image",
            });
        }

        const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

        const imagesLinks = [];
        for (let file of files) {
            const supportedTypes = ["jpg", "jpeg", "png"];
            const fileType = file.name.split('.').pop().toLowerCase();

            if (!isFileTypeSupported(fileType, supportedTypes)) {
                return res.status(400).json({
                    success: false,
                    message: "File format not supported",
                });
            }

            const result = await uploadFileToCloudinary(file, "Ritesh");
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        const productData = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            location: req.body.location,
            user: req.user.id,
            images: imagesLinks,
        };

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message,
        });
    }
};




export const getAllProducts = async (req, res) => {
    try {
    
        const products = await Product.find({ status: "approved" }).populate("user", "name email")
        
        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching products", error });
    }
};


export const getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.body).populate("user", "name email");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        
    }
};

export const getProduct = async(req,res)=>{
    try{
        const {id} = req.body;
        console.log("ID",id);
        const product = await Product.findById(id).populate("user", "name email");
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: "Error fetching product details5",
            error,
        });
    }
}


export const getMyProducts = async(req,res)=>{
    try{
        const {userId} = req.body;
        const products = await Product.find({ user: userId });
        

        res.status(200).json({
            success: true,
            products,
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
           
            success: false,
            message: "Error fetching product details5",
            error,
        });
    }
}

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating product",
            error,
        });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    const {productId} = req.body;
    console.log("Product",productId);
    try {
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error,
        });
    }
};


export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        let products;
        if(category==='All'){
            products = await Product.find();
        }
        else
        products = await Product.find({ category });

        res.status(200).json({ success: true, data:products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching category products", error });
    }
};



export const approveProduct = async(req,res)=>{
    try{
        const {productId} = req.body;
        const product = await Product.findByIdAndUpdate(
            productId,
            { status: "approved" },
            { new: true }
        );
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        res.json({ success: true, message: "Product approved", product });
    } catch(error){
        res.status(500).json({ success: false, message: "Error in approving product", error });
    }
}
export const rejectProduct = async(req,res)=>{
    try{
        const {productId} = req.body;
            const product = await Product.findByIdAndUpdate(productId, { status: "rejected" }, { new: true });
            
            if (!product) return res.status(404).json({ success: false, message: "Product not found" });
            await Product.findByIdAndDelete(productId);
            res.json({ success: true, message: "Product rejected", product });
        }catch (error) {
            res.status(500).json({ success: false, message: "Error rejecting product", error });
        }
}

export const getPendingProducts = async(req,res)=>{
    try {
        const products = await Product.find({ status: "pending" });
        console.log("Products",products);
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching pending products", error });
    }
}