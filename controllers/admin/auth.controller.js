const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const referer = req.get("referer");
  const email = req.body.email;
  const password = req.body.password;

  const account = await Account.findOne({
    email: email,
    deleted: false,
  });

  if (!account) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect(referer);
    return;
  }

  if (md5(password) != account.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect(referer);
    return;
  }

  if (account.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect(referer);
    return;
  }

  res.cookie("token", account.token);
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
};
