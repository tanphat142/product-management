const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products.helper");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  cart.totalPrice = 0;

  if (cart.products.length > 0) {
    for (const product of cart.products) {
      const productInfo = await Product.findOne({
        _id: product.productId,
      }).select("title thumbnail slug price discountPercentage");
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      product.productInfo = productInfo;
      product.totalPrice = productInfo.priceNew * product.quantity;
      cart.totalPrice += product.totalPrice;
    }
  }

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const referer = req.get("referer");
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const existProductInCart = cart.products.find(
    (item) => item.productId == productId
  );

  if (existProductInCart) {
    const quantityNew = quantity + existProductInCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        // tìm đúng object có đúng id trong array products
        "products.productId": productId,
      },
      {
        $set: {
          //$ phần tử đầu tiên trong mảng products phù hợp với điều kiện filter (products.productId = productId)
          "products.$.quantity": quantityNew,
        },
      }
    );
  } else {
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: {
          products: {
            productId: productId,
            quantity: quantity,
          },
        },
      }
    );
  }

  req.flash("success", "Thêm vào giỏ hàng thành công!");
  res.redirect(referer);
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const referer = req.get("referer");
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: {
        products: {
          productId: productId,
        },
      },
    }
  );

  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
  res.redirect(referer);
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const referer = req.get("referer");
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity);

  await Cart.updateOne(
    {
      _id: cartId,
      "products.productId": productId,
    },
    {
      $set: {
        "products.$.quantity": quantity,
      },
    }
  );

  res.redirect(referer);
};
