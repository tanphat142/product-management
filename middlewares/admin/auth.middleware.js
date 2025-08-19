const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  const user = await Account.findOne({
    token: req.cookies.token,
    deleted: false,
    status: "active"
  }).select("-password");

  if(!user) {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  const role = await Role.findOne({
    _id: user.role_id,
    deleted: false
  }).select("title permissions");

  //để tạo các biến toàn cục cho các file pug và các controller
  res.locals.user = user;
  res.locals.role = role;

  next();
}