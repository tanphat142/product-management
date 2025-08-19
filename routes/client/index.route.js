const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const userRoute = require("./user.route");
const usersRoute = require("./users.route");
const chatRoute = require("./chat.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");

module.exports = (app) => {
  //Trước khi vào bất kỳ route nào ("/", "/products", ...), luôn luôn chạy middleware này trước, để tạo biến allCategory cho view.
  app.use(categoryMiddleware.category);

  app.use(cartMiddleware.cartId);

  app.use(userMiddleware.infoUser);

  app.use(settingMiddleware.general);

  app.use("/", homeRoutes);

  app.use("/products", productRoutes);

  app.use("/search", searchRoute);

  app.use("/cart", cartRoute);

  app.use("/checkout", checkoutRoute);

  app.use("/user", userRoute);

  app.use(
    "/chat",
    userMiddleware.requireAuth,
    chatRoute
  );

  app.use(
    "/users",
    userMiddleware.requireAuth,
    usersRoute
  );

  //404
  // app.use((req, res) => {
  //   res.status(404).render("client/pages/errors/404", {
  //     pageTitle: "Trang không tồn tại",
  //   });
  // });
};
