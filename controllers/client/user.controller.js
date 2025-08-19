const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/sendMail.helper");

const Cart = require("../../models/cart.model");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const referer = req.get("referer");

  const existUser = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existUser) {
    req.flash("error", "Email đã tồn tại trong hệ thống!");
    res.redirect(referer);
    return;
  }

  req.body.password = md5(req.body.password);

  req.body.tokenUser = generateHelper.generateRandomString(30);

  const newUser = new User(req.body);
  await newUser.save();

  const cart = await Cart.findOne({
    user_id: newUser.id,
  });

  if (cart) {
    res.cookie("cartId", cart.id);
  } else {
    await Cart.updateOne(
      {
        _id: req.cookies.cartId,
      },
      {
        user_id: newUser.id,
      }
    );
  }

  res.cookie("tokenUser", newUser.tokenUser);

  // req.flash("success", "Đăng ký tài khoản thành công!");

  res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const referer = req.get("referer");
  const email = req.body.email;
  const password = req.body.password;

  const existUser = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!existUser) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect(referer);
    return;
  }

  if (md5(password) != existUser.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect(referer);
    return;
  }

  if (existUser.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect(referer);
    return;
  }

  res.cookie("tokenUser", existUser.tokenUser);

  await User.updateOne(
    {
      email: email,
    },
    {
      statusOnline: "online",
    }
  );

  _io.once("connection", (socket) => {
    _io.emit("SERVER_RETURN_STATUS_ONLINE_USER", {
      userId: existUser.id,
      statusOnline: "online",
    });
  });

  req.flash("success", "Đăng nhập thành công!");

  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne(
    {
      tokenUser: req.cookies.tokenUser,
    },
    {
      statusOnline: "offline",
    }
  );

  _io.once("connection", (socket) => {
    _io.emit("SERVER_RETURN_STATUS_ONLINE_USER", {
      userId: res.locals.user.id,
      statusOnline: "offline",
    });
  });

  res.clearCookie("tokenUser");

  req.flash("success", "Đã đăng xuất!");

  res.redirect("/");
};

module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const referer = req.get("referer");
  const email = req.body.email;

  const existUser = await User.findOne({
    email: email,
    status: "active",
    deleted: false,
  });

  if (!existUser) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(referer);
    return;
  }

  // Việc 1: Lưu email và mã OTP vào database
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email,
  });

  if (!existEmailInForgotPassword) {
    const otp = generateHelper.generateRandomNumber(6);

    const data = {
      email: email,
      otp: otp,
      expireAt: Date.now() + 5 * 60 * 1000,
    };

    const record = new ForgotPassword(data);
    await record.save();

    // Việc 2: Gửi mã OTP qua email cho user
    const subject = "Xác thực mã OTP";
    const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;

    sendMailHelper.sendMail(email, subject, text);
  }

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Xác thực OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const referer = req.get("referer");
  const email = req.body.email;
  const otp = req.body.otp;

  const existRecord = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!existRecord) {
    req.flash("error", "Mã OTP không hợp lệ!");
    res.redirect(referer);
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      token: tokenUser,
      status: "active",
      deleted: false,
    },
    {
      password: md5(password),
    }
  );

  req.flash("success", "Đổi mật khẩu thành công!");

  res.redirect("/");
};

// [GET] /user/profile
module.exports.profile = async (req, res) => {
  res.render("client/pages/user/profile", {
    pageTitle: "Thông tin tài khoản",
  });
};
