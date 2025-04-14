import express from "express";
import { approveProduct, createProduct, deleteProduct, getAllProducts ,getMyProducts,getPendingProducts,getProduct,getProductDetails, getProductsByCategory, rejectProduct, updateProduct} from "../controllers/productController.js";
import { auth, isAdmin } from "../middlewares/auth.js";

const router = express.Router();


router.post("/createProduct",auth,createProduct);
router.get("/getAllProducts",getAllProducts);
router.post("/getProductDetail",getProductDetails);
router.post("/getProduct",getProduct);
router.post("/myProducts",getMyProducts);
router.post("/deleteProduct",deleteProduct);
router.put("/update/:id",updateProduct);
router.get("/category/:category",getProductsByCategory);
router.get("/getPendingProducts",getPendingProducts);
router.post("/approveProduct",auth,isAdmin,approveProduct);
router.post("/rejectProduct",auth,isAdmin,rejectProduct);


export default router;