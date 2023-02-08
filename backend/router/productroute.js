const express = require('express')
const data = require('../controller/productcontroller');
const auth = require('../middelwear/auth');
const router = express.Router()

router.route("/products").get(data.getAllProduct);
router.route("/admin/product/new").post(auth.isAuthenticatedUser,auth.authorizeRole("admin")  ,data.createProduct);
router.route("/admin/product/:id").put(auth.isAuthenticatedUser, auth.authorizeRole("admin") ,data.updateProduct).delete(auth.isAuthenticatedUser, auth.authorizeRole("admin") ,data.DeleteProdct)
router.route("/product/:id").get(data.GetProductDetails);
router.route("/review").put(auth.isAuthenticatedUser,data.CreateProductReview);
router.route("/reviews").get(data.GetProductReviews)
//  .delete(auth.isAuthenticatedUser,data.DeleteReview)

module.exports = router  