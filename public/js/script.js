// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Alert

// Cập nhật số lượng sản phẩm trong giỏ hàng
const listInputQuantity = document.querySelectorAll("[cart] input[name='quantity']");
if(listInputQuantity.length > 0) {
  listInputQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("product-id");
      const quantity = parseInt(input.value);

      if(productId && quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    })
  })
}
// Hết Cập nhật số lượng sản phẩm trong giỏ hàng