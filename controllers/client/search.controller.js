const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products.helper")

// [GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let products = [];

  if(keyword) {
    const regex = new RegExp(keyword, "i");

    products = await Product.find({
      title: regex,
      status: "active",
      deleted: false
    });

    for (const item of products) {
      item.priceNew = productsHelper.priceNewProduct(item);;
    }
  }

  res.render("client/pages/search/index", {
    pageTitle: "Tìm kiếm",
    keyword: keyword,
    products: products
  });
}