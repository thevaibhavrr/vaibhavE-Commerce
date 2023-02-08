const express = require('express')
const router = express.Router()
const auth = require("../middelwear/auth");
const dataorder = require('../controller/ordercontroller')


router.route('/order/new').post(auth.isAuthenticatedUser,dataorder.newOrder)
router.route('/order/:id').get(auth.isAuthenticatedUser,dataorder.GetSingleOrder)
router.route('/orders/me').get(auth.isAuthenticatedUser,dataorder.myOrders)
router.route('/admin/orders').get(auth.isAuthenticatedUser,auth.authorizeRole("admin"),dataorder.GetAllOrders)
router.route('/admin/order/:id').put(auth.isAuthenticatedUser,auth.authorizeRole("admin"),dataorder.UpdateOrders).delete(auth.isAuthenticatedUser,auth.authorizeRole("admin"),dataorder.DeleteOrder)


// swagger
// dao

module.exports = router