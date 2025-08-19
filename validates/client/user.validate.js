module.exports.registerPost = async (req, res, next) => {
  const referer = req.get("referer");
  if(!req.body.fullName) {
    req.flash("error", "Fullname không được để trống!");
    res.redirect(referer);
    return;
  }

  if(!req.body.email) {
    req.flash("error", "Email không được để trống!");
    res.redirect(referer);
    return;
  }

  if(!req.body.password) {
    req.flash("error", "Password không được để trống!");
    res.redirect(referer);
    return;
  }

  // next() để chuyển sang middleware tiếp theo
  next();
}

module.exports.loginPost = async (req, res, next) => {
  const referer = req.get("referer");

  if(!req.body.email) {
    req.flash("error", "Email không được để trống!");
    res.redirect(referer);
    return;
  }

  if(!req.body.password) {
    req.flash("error", "Password không được để trống!");
    res.redirect(referer);
    return;
  }

  // next() để chuyển sang middleware tiếp theo
  next();
}