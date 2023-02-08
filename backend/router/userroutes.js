const express = require("express");
const data = require("../controller/usercontroller");
const router = express.Router();
const auth = require("../middelwear/auth");

router.route("/register").post(data.RegisterUser);
router.route("/login").post(data.Loginuser);
router.route("/logout").get(data.Logout);
// router.route("/password/forgot").post(data.ForgotPassword);
router.route("/me").get(auth.isAuthenticatedUser, data.UserDetails);
router
  .route("/password/update")
  .put(auth.isAuthenticatedUser, data.UpdatUserPassword);
router.route("/me/update").put(auth.isAuthenticatedUser, data.UpdatUserProfile);
router
  .route("/admin/users")
  .get(auth.isAuthenticatedUser, auth.authorizeRole("admin"), data.GetAllUser);
router
  .route("/admin/users/:id")
  .get(
    auth.isAuthenticatedUser,
    auth.authorizeRole("admin"),
    data.GetsingleUser
  )
  .put(
    auth.isAuthenticatedUser,
    auth.authorizeRole("admin"),
    data.UpdatUserrolebyadmin
  )
  .delete(
    auth.isAuthenticatedUser,
    auth.authorizeRole("admin"),
    data.DeleteUservyAdmin
  );

module.exports = router;
