const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products.helper")

// [GET] /products/
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({
    position: "desc",
  });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const product = await Product.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });

  if(product.product_category_id) {
    const category = await ProductCategory.findOne({
      _id: product.product_category_id,
      status: "active",
      deleted: false
    });

    product.category = category;
  }

  product.priceNew = productsHelper.priceNewProduct(product);

  if(product) {
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } else {
    res.redirect("/products");
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  const category = await ProductCategory.findOne({
    slug: slugCategory,
    status: "active",
    deleted: false
  });

  const allSubCategory = [];

  const getSubCategory = async (currentId) => {
    const subCategory = await ProductCategory.find({
      parent_id: currentId,
      status: "active",
      deleted: false
    });

    for (const sub of subCategory) {
      allSubCategory.push(sub.id);
      await getSubCategory(sub.id);
    }
  }

  await getSubCategory(category.id);

  // $in tìm những sản phẩm thuộc 1 trong các danh mục trong []

  const products = await Product
    .find({
      product_category_id: {
        $in: [
          category.id,
          ...allSubCategory
        ]
      },
      status: "active",
      deleted: false
    })
    .sort({
      position: "desc"
    });

  const newProducts = productsHelper.priceNewProducts(products);

  // console.log(products);

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts
  });
}

