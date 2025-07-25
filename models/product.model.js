const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

// slug là 1 url để con bot google dễ dàng tìm kiếm
// slug là 1 chuỗi duy nhất, không trùng lặp

// ví dụ tiêu đề là "Sản phẩm 1" thì slug sẽ là "san-pham-1"

const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  createdBy: String,
  createdAt: Date,
  // updatedBy: String,
  // updatedAt: Date,
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date,
    },
  ],
  featured: String,
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: String,
  deletedAt: Date,
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
