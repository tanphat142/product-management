const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

// slug là 1 url để con bot google dễ dàng tìm kiếm
// slug là 1 chuỗi duy nhất, không trùng lặp

// ví dụ tiêu đề là "Sản phẩm 1" thì slug sẽ là "san-pham-1"

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
  }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
