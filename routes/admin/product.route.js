const express = require("express");
const router = express.Router();

// multer để upload file
const multer = require("multer");
const storage = require("../../helpers/storageMulter")(); // hàm này dùng để lưu file vào thư mục ./public/uploads/ và đổi tên file
const upload = multer({ storage: storage });

const controller = require("../../controllers/admin/product.controller");

const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

// xóa vĩnh viễn
// router.delete("/delete", controller.delete);

// xóa mềm
router.patch("/delete", controller.delete);

// trường hợp thay đổi vị trí khi change input
// router.patch("/change-position", controller.changePosition);

// vẽ giao diện tạo mới
router.get("/create", controller.create);

// xử lý tạo mới để submit form
// trường hợp có upload file
router.post(
  "/create",
  upload.single("thumbnail"),
  //middleware validate(trung gian A->C thì phải đi qua B, B là validate)
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single('thumbnail'),
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;
