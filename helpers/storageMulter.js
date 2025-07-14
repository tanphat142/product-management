const multer  = require('multer');

module.exports = () => {
  // hàm này dùng để lưu file vào thư mục ./public/uploads/ và đổi tên file
  const storage = multer.diskStorage({
    // lưu file vào thư mục ./public/uploads/
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    // đổi tên file để tránh trùng lặp
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName)
    }
  });

  return storage;
}