// // Bộ lọc
// //tự định nghĩa thêm [tên thuộc tính]
// const boxFilter = document.querySelector("[box-filter]");
// if (boxFilter) {
//   let url = new URL(location.href); // Nhân bản url để thay đổi url

//   // Bắt sự kiện onChange
//   boxFilter.addEventListener("change", () => {
//     const value = boxFilter.value;

//     if (value) {
//       //sau dấu ? là searchParams
//       url.searchParams.set("status", value);
//     } else {
//       //nếu không có giá trị thì xóa
//       url.searchParams.delete("status");
//     }

//     // Cập nhật URL và chuyển hướng(window.location.href)
//     location.href = url.href;
//   });

//   // Hiển thị lựa chọn mặc định
//   const statusCurrent = url.searchParams.get("status");
//   if (statusCurrent) {
//     boxFilter.value = statusCurrent;
//   }
// }
// // Hết Bộ lọc

// Button Status

const listButtonStatus = document.querySelectorAll("[button-status]");
if (listButtonStatus.length > 0) {
  let url = new URL(location.href);

  // Bắt sự kiện click
  listButtonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      location.href = url.href;
    });
  });

  // Thêm class active mặc định
  const statusCurrent = url.searchParams.get("status") || "";
  const buttonCurrent = document.querySelector(
    `[button-status="${statusCurrent}"]`
  );
  if (buttonCurrent) {
    buttonCurrent.classList.add("active");
  }
}
// End Button Status

// Form Search
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  let url = new URL(location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    location.href = url.href;
  });
}
// End Form Search

// Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if (listButtonPagination.length > 0) {
  let url = new URL(window.location.href);

  listButtonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);

      window.location.href = url.href;
    });
  });
}
// End Pagination

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

// Preview ảnh
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  const closeButton = uploadImage.querySelector("[close-preview]");

  uploadImageInput.addEventListener("change", () => {
    // uploadImageInput la e.target ma trong e.target co thuoc tinh files
    const file = uploadImageInput.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      closeButton.classList.add("centered-close");
    }
  });

  closeButton.addEventListener("click", () => {
    uploadImagePreview.src = "";
    uploadImageInput.value = "";
    closeButton.style.display = "none"; // ẩn lại nút x
  });
}
// Hết Preview ảnh