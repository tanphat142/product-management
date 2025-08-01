const express = require("express");
const router = express.Router();
const multer  = require('multer');

const upload = multer();

const uploadCloud = require("../../‎middleware/admin/uploadCloud.middleware");

const controller = require("../../controllers/admin/account.controller");

const validate = require("../../validates/admin/account.validate");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  validate.editPatch,
  controller.editPatch
);

router.get("/change-password/:id", controller.changePassword);

router.patch("/change-password/:id", controller.changePasswordPatch);

module.exports = router;