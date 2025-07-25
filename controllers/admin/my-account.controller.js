const Account = require("../../models/account.model");
const md5 = require("md5");

// [GET] /admin/my-account/
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thông tin cá nhân"
  });
}

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân"
  });
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const referer = req.get("referer");
  const id = res.locals.user.id;

  //$ne: tìm tất cả bản ghi trừ id hiện tại
  const emailExit = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });

  if (emailExit) {
    req.flash("error", "Email đã tồn tại!");
  } else {
    if (req.body.password == "") {
      delete req.body.password;
    } else {
      req.body.password = md5(req.body.password);
    }

    await Account.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    req.flash("success", "Cập nhật thành công!");

  }
  res.redirect(referer);
}