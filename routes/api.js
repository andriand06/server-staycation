//panggil express
const express = require("express");
//panggil router dari express
const router = express.Router();
//panggil api controller kita (isinya function untuk handle view kita dari route)
const apiController = require("../controllers/apiController");
const { upload } = require("../middlewares/multer");

//route /landing-page maka panggil function landingPage
router.get("/landing-page", apiController.landingPage);
router.get("/detail-page/:id", apiController.detailPage);
router.post("/booking-page", upload, apiController.bookingPage);
//export routernya
module.exports = router;
