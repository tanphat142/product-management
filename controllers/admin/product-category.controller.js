const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree.helper");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const listCategory = await ProductCategory.find(find);

  const newCategories = createTreeHelper(listCategory);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh sách danh mục sản phẩm",
    record: newCategories,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false,
  });

  const newCategories = createTreeHelper(categories);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    categories: newCategories,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countRecord = await ProductCategory.countDocuments();
    req.body.position = countRecord + 1;
  }

  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const category = await ProductCategory.findOne({
    _id: id,
    deleted: false,
  });

  const categories = await ProductCategory.find({
    deleted: false,
  });

  const newCategories = createTreeHelper(categories);

  res.render("admin/pages/products-category/edit", {
    pageTitle: "Chỉnh sửa danh mục sản phẩm",
    categories: newCategories,
    category: category,
  });
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const referer = req.get("referer");
  const id = req.params.id;

  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countCagegory = await ProductCategory.countDocuments({});
    req.body.position = countCagegory + 1;
  }

  await ProductCategory.updateOne(
    {
      _id: id,
      deleted: false,
    },
    req.body
  );

  req.flash("success", "Cập nhật danh mục thành công!");

  res.redirect(referer);
};
