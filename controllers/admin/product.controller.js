const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");

const searchHelper = require("../../helpers/search");
const filterStatusHelper = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination.helper");

const createTreeHelper = require("../../helpers/createTree.helper");

const Account = require("../../models/account.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  // console.log(req.query.status);

  //bo loc
  const filterStatus = filterStatusHelper();

  const find = {
    deleted: false,
  };

  // Lọc theo trạng thái
  if (req.query.status) {
    //thêm status để find
    find.status = req.query.status;
  }
  // Hết Lọc theo trạng thái

  // Tìm kiếm
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Hết Tìm kiếm

  // Phân trang
  // dem tong so san pham
  const countProducts = await Product.countDocuments(find);

  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  // Hết Phân trang

  // Sắp xếp
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    // truyen 1 string thi phai dung []
    sort[sortKey] = sortValue;
  } else {
    sort["position"] = "desc";
  }
  // Hết Sắp xếp

  const products = await Product.find(find)
    .limit(pagination.limitItems)
    .skip(pagination.skip)
    .sort(sort);

  //logs lịch sử thay đổi sản phẩm
  for (const item of products) {
    // Tạo bởi
    const infoCreated = await Account.findOne({
      _id: item.createdBy,
    });

    if (infoCreated) {
      item.createdByFullName = infoCreated.fullName;
    } else {
      item.createdByFullName = "";
    }

    // Cập nhật bởi
    //logs(1)
    // const infoUpdated = await Account.findOne({
    //   _id: item.updatedBy,
    // });

    // if (infoUpdated) {
    //   item.updatedByFullName = infoUpdated.fullName;
    // } else {
    //   item.updatedByFullName = "";
    // }
    //logs(nhiều) lấy thằng mới nhất
    const updatedBy = item.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const infoUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      
      if (infoUpdated) {
        updatedBy.accountFullName = infoUpdated.fullName;
      } else {
        updatedBy.accountFullName = "";
      }
    }
  }

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.body;

  //thêm logs (lưu nhiều)
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    {
      _id: id,
    },
    {
      status: status,
      // thêm logs(lưu 1)
      // updatedBy: res.locals.user.id,
      // updatedAt: new Date(),

      $push: { updatedBy: updatedBy },
    }
  );

  // Thông báo thành công
  // key: success
  req.flash("success", "Đổi trạng thái thành công!");

  res.json({
    code: "success",
  });
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const { status, ids } = req.body;

  //thêm logs (lưu nhiều)
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (status) {
    case "active":
    case "inactive":
      await Product.updateMany(
        {
          _id: ids,
        },
        {
          status: status,
          // logs(lưu 1)
          // updatedBy: res.locals.user.id,
          // updatedAt: new Date(),
          $push: { updatedBy: updatedBy },
        }
      );

      req.flash("success", `Đổi trạng thái thành công ${ids.length} sản phẩm!`);

      res.json({
        code: "success",
      });

      break;
    case "delete":
      await Product.updateMany(
        {
          _id: ids,
        },
        {
          deleted: true,
          deletedBy: res.locals.user.id,
          deletedAt: new Date(),
        }
      );

      req.flash("success", "Xóa thành công!");

      res.json({
        code: "success",
      });

      break;

    // trường hợp thay đổi vị trí khi chọn
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          {
            _id: id,
          },
          {
            position: position,
            // updatedBy: res.locals.user.id,
            // updatedAt: new Date(),
            $push: { updatedBy: updatedBy },
          }
        );
      }

      req.flash("success", "Đổi vị trí thành công!");

      res.json({
        code: "success",
      });

      break;
    default:
      break;
  }
};

// xóa vĩnh viễn
// [DELETE] /admin/products/delete

// module.exports.delete = async (req, res) => {
//   await Product.deleteOne({
//     _id: req.body.id,
//   });

//   req.flash("success", "Xóa thành công!");

//   res.json({
//     code: "success",
//   });
// };

// xóa mềm
// [PATCH] /admin/products/delete

module.exports.delete = async (req, res) => {
  await Product.updateOne(
    {
      _id: req.body.id,
    },
    {
      deleted: true,
      //thêm trường deleteAt để biết thời gian xóa
      deletedBy: res.locals.user.id,
      deletedAt: new Date(),
    }
  );

  req.flash("success", "Xóa thành công!");

  res.json({
    code: "success",
  });
};

// [PATCH] /admin/products/change-position

// trường hợp thay đổi vị trí khi change input

// module.exports.changePosition = async (req, res) => {
//   await Product.updateOne(
//     {
//       _id: req.body.id,
//     },
//     {
//       position: req.body.position,
//       updatedBy: res.locals.user.id,
//       updatedAt: new Date()
//     }
//   );

//   req.flash('success', 'Đổi vị trí thành công!');

//   res.json({
//     code: "success",
//   });
// };

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false,
  });

  const newCategories = createTreeHelper(categories);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    categories: newCategories,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  //thêm trường lưu logs
  req.body.createdBy = res.locals.user.id;
  req.body.createdAt = new Date();

  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countRecord = await Product.countDocuments();
    req.body.position = countRecord + 1;
  }

  // /uploads/${req.file.filename} la đường dẫn để hiển thị ảnh

  // local
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }

  //  tạo ở phía Model
  const record = new Product(req.body);
  //  lưu vào CSDL
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    });

    if (product) {
      const categories = await ProductCategory.find({
        deleted: false,
      });

      const newCategories = createTreeHelper(categories);

      res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product,
        categories: newCategories,
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const referer = req.get("referer");
  try {
    const id = req.params.id;

    //local
    // if (req.file && req.file.filename) {
    //   req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    // thêm logs lịch sử (lưu 1)
    // req.body.updatedBy = res.locals.user.id;
    // req.body.updatedAt = new Date();

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countProducts = await Product.countDocuments({});
      req.body.position = countProducts + 1;
    }

    //thêm logs (lưu nhiều)
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      {
        _id: id,
        deleted: false,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Id sản phẩm không hợp lệ!");
  }

  res.redirect(referer);
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    });

    if (product) {
      res.render("admin/pages/products/detail", {
        pageTitle: product.title,
        product: product,
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};
