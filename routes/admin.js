const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { upload, uploadMultiple } = require("../middlewares/multer");
const auth = require("../middlewares/auth");
router.get("/signin", adminController.viewSignIn);
router.post("/signin", adminController.actionSignIn);
/**
 * sebelum ke /dashboard dilakukan auth terlebih dahulu apakah sudah ada session atau belum
 */
router.use(auth);
router.get("/logout", adminController.actionLogout);
router.get("/dashboard", adminController.viewDashboard);
/**
 * ENDPOINT CATEGORY
 */
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category", adminController.deleteCategory);

/**
 * ENDPOINT BANK
 */
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank", adminController.deleteBank);

/**
 * ENDPOINT ITEM
 */
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showItemImage);
router.get("/item/detail/:id", adminController.showDetailItem);
router.get("/item/edit/:id", adminController.editItem);
router.put("/item", uploadMultiple, adminController.updateItem);
router.delete("/item", adminController.deleteItem);
router.post("/item/new-feature/:id", upload, adminController.addItemFeature);
router.put("/item/feature", upload, adminController.updateItemFeature);
router.delete("/item/feature", adminController.deleteItemFeature);
router.post("/item/new-activity/:id", upload, adminController.addItemActivity);
router.put("/item/activity", upload, adminController.updateItemActivity);
router.delete("/item/activity", adminController.deleteItemActivity);
/**
 * ENDPOINT BOOKING
 */
router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.showDetailBooking);
router.put("/booking/:id/confirm", adminController.actionConfirmBooking);
router.put("/booking/:id/reject", adminController.actionRejectBooking);
module.exports = router;
