const Product = require("../model/productmodel");
const ErrorHander = require("../utils/errorHandel");
const catchAyncErrors = require("../middelwear/catchAsyncError");
const ApiFeatures = require("../utils/apifeture");

// create product --Admin

const createProduct = catchAyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// get All Product
const getAllProduct = catchAyncErrors(async (req, res,next) => {

  const resultPerPage = 8;
  const ProductCount = await Product.countDocuments();
  const apifeture = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  let products = await apifeture.query;

  res.status(200).json({ success: true, products, ProductCount,resultPerPage });
});

// Update products --Admin
const updateProduct = catchAyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, product });
});

// Delete Product
const DeleteProdct = catchAyncErrors(async (req, res,next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product not found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "product deleted succesfull",
    product,
  });
});

// Get Product Details
const GetProductDetails = catchAyncErrors(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
}); 

// Create product review and update review
const CreateProductReview = catchAyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});
// All Reviews
const GetProductReviews = catchAyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHander("product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});


// // Delete Review
// const DeleteReview = catchAyncErrors(async (req, res, next) => {
//     const product = await Product.findById(req.query.productId);
//     if (!product) {
//       return next(new ErrorHander("product not found", 404));
//     }
//     const reviews = product.reviews.filter(
//       (rev) => rev._id.toString() !== req.query.id.toString()
//     );

//     let avg = 0;
//     reviews.forEach((rev) => {
//       avg += rev.rating;
//     });

//     const ratings = avg / reviews.length;
//     const numOfReviews = reviews.length;
//     await Product.findByIdAndUpdate(
//       req.query.productId,
//       {
//         reviews,
//         ratings,
//         numOfReviews,
//       },
//       {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//       }
//     );

//     res.status(200).json({
//       success: true,
//     });
// });

// const DeleteReview = catchAsyncErrors(async (req, res, next) => {
//   const product = await Product.findById(req.query.productId);

//   if (!product) {
//     return next(new ErrorHander("Product not found", 404));
//   }

//   const reviews = product.reviews.filter(
//     (rev) => rev._id.toString() !== req.query.id.toString()
//   );

//   let avg = 0;

//   reviews.forEach((rev) => {
//     avg += rev.rating;
//   });

//   let ratings = 0;

//   if (reviews.length === 0) {
//     ratings = 0;
//   } else {
//     ratings = avg / reviews.length;
//   }

//   const numOfReviews = reviews.length;

//   await Product.findByIdAndUpdate(
//     req.query.productId,
//     {
//       reviews,
//       ratings,
//       numOfReviews,
//     },
//     {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     }
//   );

module.exports = {
  getAllProduct,
  createProduct,
  updateProduct,
  DeleteProdct,
  GetProductDetails,
  CreateProductReview,
  GetProductReviews,
};
