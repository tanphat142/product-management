module.exports.createPost = async (req, res, next) => {
  const referer = req.get("referer");
  console.log(referer);
  if(!req.body.title) {
    req.flash("error", "Tiêu đề không được để trống!");
    res.redirect(referer);
    return;
  }

  if(req.body.title.length < 5) {
    req.flash("error", "Tiêu đề ít nhất là 5 ký tự!");
    res.redirect(referer);
    return;
  }

  // next() để chuyển sang middleware tiếp theo
  next();
}