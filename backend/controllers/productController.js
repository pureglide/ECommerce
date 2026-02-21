import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, detailedDescription, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            detailedDescription,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);
        if (product) {
            // 2. Delete images from Cloudinary
            if (product.image && product.image.length > 0) {
                await Promise.all(product.image.map(async (imageUrl) => {
                    // Extract public_id from the image URL
                    // URL format usually ends with: /<public_id>.<extension>
                    const publicId = imageUrl.split('/').pop().split('.')[0];
                    
                    // Delete the image using the extracted public_id
                    await cloudinary.uploader.destroy(publicId);
                }));
            }

            // 3. Delete the product data from MongoDB
            await productModel.findByIdAndDelete(req.body.id);

            res.json({ success: true, message: "Product and images removed successfully" });
        } else {
            res.json({ success: false, message: "Product not found" });
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to toggle stock status
const toggleStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        
        await productModel.findByIdAndUpdate(id, { inStock });
        
        res.json({ success: true, message: "Stock Status Updated" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        
        const { id, name, description, detailedDescription, price, category, subCategory, sizes, bestseller, inStock } = req.body

        if (!id) {
            return res.json({ success: false, message: "Product ID is required" })
        }

        const updateData = {
            name,
            description,
            detailedDescription,
            category,
            subCategory,
            price: Number(price),
            bestseller: bestseller === "true" ? true : false,
            inStock: inStock === "true" ? true : false,
            sizes: sizes ? JSON.parse(sizes) : []
        }

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        if (images.length > 0) {
            let imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url
                })
            )
            updateData.image = imagesUrl
        }

        await productModel.findByIdAndUpdate(id, updateData)

        res.json({ success: true, message: "Product Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, toggleStock, updateProduct }