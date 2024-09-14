import { UserController } from "controllers";
import { ProductController } from "controllers/productsController";
import { Router } from "express";

let router: Router = Router()

// users
router.get("/users", UserController.getAllUser)
router.post("/users/new", UserController.createUser)
router.patch("/users/update", UserController.updateUser)
router.delete("/users/delete/:id", UserController.deleteUser)


// products
router.get("/products", ProductController.getAllProducts)
router.post("/products/new", ProductController.createProduct)
router.patch("/products/update", ProductController.updateProduct)
router.delete("/products/delete/:id", ProductController.deleteProduct)


export default router