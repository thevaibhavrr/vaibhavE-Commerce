const Order = require("../model/orderModel");
const Product = require("../model/productmodel");
const ErrorHander = require("../utils/errorHandel");
const catchAyncErrors = require("../middelwear/catchAsyncError");

// create new order
const newOrder = catchAyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });
  res.status(201).json({
    sucess: true,
    order,
  });
});

// Get Single Order
const GetSingleOrder = catchAyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHander("Order not found with this id", 404));
  }
  res.status(200).json({
    sucess: true,
    order,
  });
});

// Get Single Order
const myOrders = catchAyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    sucess: true,
    orders,
  });
});

// get all Order --Admin
const GetAllOrders = catchAyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.paymentInfo.totalPrice;
  });

  res.status(200).json({
    sucess: true,
    totalAmount,
    orders,
  });
});

// update Order Status --Admin
const UpdateOrders = catchAyncErrors(async (req, res ,next) => {
  const order = await Order.findById(req.params.id);

   if (!order) {
     return next(new ErrorHander("Order not found with this id", 404));
   }

  if (order.paymentInfo.orderStatus === "Delivered") {
    return next(
      new ErrorHander("You have alreday delivered this product ", 400)
    );
  }

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  order.paymentInfo.orderStatus = req.body.status;


  if (req.body.status === "Delivered") {
    order.delivereAt = Date.now();
  }

  await order.save({
    validateBeforeSave: false,
  });
  res.status(200).json({
    sucess: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;

  await product.save({
    validateBeforeSave: false,
  });
}

// delete order

const DeleteOrder = catchAyncErrors(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHander("Order not found with this id", 404));
  }
  await order.remove();
  res.status(200).json({
    success: true,
  });
});

module.exports = {
  newOrder,
  myOrders,
  GetSingleOrder,
  GetAllOrders,
  UpdateOrders,
  DeleteOrder,
};
