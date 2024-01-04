const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

const authentication = require("../midlewares/auth.midleware");

// Rotas para CRUD de produtos
router.get("/products", authentication, productController.getAllProducts);
router.post("/products", authentication, productController.createProduct);
router.get("/products/:id", authentication, productController.getProductById);
router.put("/products/:id", authentication, productController.updateProduct);
router.delete("/products/:id", authentication, productController.deleteProduct);

module.exports = router;
