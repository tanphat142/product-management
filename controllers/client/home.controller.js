const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products.helper")

// [GET] /
module.exports.index = async (req, res) => {
  // Sản phẩm nổi bật
  const productsFeatured = await Product
    .find({
      deleted: false,
      status: "active",
      featured: "1"
    })
    .sort({
      position: "desc"
    })
    .limit(6);

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

  // Sản phẩm mới
  const productsNew = await Product
    .find({
      deleted: false,
      status: "active"
    })
    .sort({
      position: "desc"
    })
    .limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);

  // Sản phẩm giảm giá nhiều
  const productsDiscount = await Product
    .find({
      deleted: false,
      status: "active"
    })
    .sort({
      discountPercentage: "desc"
    })
    .limit(6);

  const newProductsDiscount = productsHelper.priceNewProducts(productsDiscount);

  // Lấy ra các sản phẩm cụ thể (theo id)
  const productsChoose = await Product
    .find({
      _id: {
        $in: [
          "66db039c34f3f34435263b0b",
          "66e1959e5a6d26e7383dacb1"
        ]
      },
      deleted: false,
      status: "active"
    })
    .sort({
      position: "desc"
    });

  const newProductsChoose = productsHelper.priceNewProducts(productsChoose);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
    productsDiscount: newProductsDiscount,
    productsChoose: newProductsChoose
  });
}
