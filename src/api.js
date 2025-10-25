import { Router } from "express";
import userRoutes from "./modules/authentication/auth.routes.js"
import productRoutes from "./modules/products/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js"

const router = Router();

router.use("/user", userRoutes)
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/profile", profileRoutes)


export default router;
