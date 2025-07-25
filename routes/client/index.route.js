const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");

const categoryMiddleware = require("../../‎middleware/client/category.middleware");
const cartMiddleware = require("../../‎middleware/client/cart.middleware");

module.exports = (app) => {
  //Trước khi vào bất kỳ route nào ("/", "/products", ...), luôn luôn chạy middleware này trước, để tạo biến allCategory cho view.
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);

  app.use("/", homeRoutes);

  app.use("/products", productRoutes);

  app.use("/search", searchRoute);

  app.use("/cart", cartRoute);
};
