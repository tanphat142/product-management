// Đổi trạng thái
const listButtonChangeStatus = document.querySelectorAll(
  "[button-change-status]"
);
if (listButtonChangeStatus.length > 0) {
  listButtonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("item-id");
      const statusChange = button.getAttribute("button-change-status");
      const path = button.getAttribute("data-path");

      const data = {
        id: itemId,
        status: statusChange,
      };

      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            location.reload();
          }
        });
    });
  });
}
// Hết Đổi trạng thái

// Check Item
const inputCheckAll = document.querySelector("input[name='checkAll']");
if (inputCheckAll) {
  const listInputCheckItem = document.querySelectorAll(
    "input[name='checkItem']"
  );

  // Bắt sự kiện click vào nút checkAll
  inputCheckAll.addEventListener("click", () => {
    listInputCheckItem.forEach((inputCheckItem) => {
      inputCheckItem.checked = inputCheckAll.checked;
    });
  });

  // Bắt sự kiện click vào nút checkItem
  listInputCheckItem.forEach((inputCheckItem) => {
    inputCheckItem.addEventListener("click", () => {
      const listInputCheckItemChecked = document.querySelectorAll(
        "input[name='checkItem']:checked"
      );

      if (listInputCheckItem.length == listInputCheckItemChecked.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// End Check Item

// Box Actions
const boxActions = document.querySelector("[box-actions]");
if (boxActions) {
  const button = boxActions.querySelector("button");

  button.addEventListener("click", (e) => {
    const select = boxActions.querySelector("select");
    const status = select.value;

    const listInputChecked = document.querySelectorAll(
      "input[name='checkItem']:checked"
    );

    if (status == "delete") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");

      if (!isConfirm) {
        return;
      }
    }

    if (listInputChecked.length > 0) {
      const ids = [];
      listInputChecked.forEach((input) => {
        const id = input.value;

        // Trường hợp thay đổi vị trí
        if (status == "change-position") {
          // closest("tr") để đang đứng từ td của input ra thằng cha tr để truy cập đến input position
          const position = input
            .closest("tr")
            .querySelector("[input-position]").value;

          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      if (status != "" && ids.length > 0) {
        const dataChangeMulti = {
          status: status,
          ids: ids,
        };

        const path = boxActions.getAttribute("box-actions");

        fetch(path, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataChangeMulti),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "success") {
              location.reload();
            }
          });
      } else {
        alert("Hành động và checkItem phải được chọn!");
      }
    }
  });
}
// End Box Actions

// Xóa bản ghi
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");

      if (isConfirm) {
        const id = button.getAttribute("item-id");
        const path = button.getAttribute("data-path");

        fetch(path, {
          headers: {
            "Content-Type": "application/json",
          },
          // xóa vĩnh viễn
          // method: "DELETE",

          // xóa mềm
          method: "PATCH",
          body: JSON.stringify({
            id: id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "success") {
              location.reload();
            }
          });
      }
    });
  });
}
// Hết Xóa bản ghi

// Đổi vị trí
// trường hợp thay đổi vị trí khi change input

// const listInputPosition = document.querySelectorAll("[input-position]");
// if (listInputPosition.length > 0) {
//   listInputPosition.forEach((input) => {
//     input.addEventListener("change", () => {
//       const position = parseInt(input.value);
//       const id = input.getAttribute("item-id");
//       const path = input.getAttribute("data-path");

//       fetch(path, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         method: "PATCH",
//         body: JSON.stringify({
//           id: id,
//           position: position,
//         }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.code == "success") {
//             location.reload();
//           }
//         });
//     });
//   });
// }
// Hết Đổi vị trí

// Sắp xếp
const sortSelect = document.querySelector("[sort-select]");
if (sortSelect) {
  let url = new URL(location.href); // Nhân bản url

  // Bắt sự kiện onChange
  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;

    if (value) {
      const [sortKey, sortValue] = value.split("-");
      console.log(sortKey);
      console.log(sortValue);

      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
    } else {
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
    }

    location.href = url.href;
  });

  // Hiển thị lựa chọn mặc định
  const sortKeyCurrent = url.searchParams.get("sortKey");
  const sortValueCurrent = url.searchParams.get("sortValue");
  if (sortKeyCurrent && sortValueCurrent) {
    sortSelect.value = `${sortKeyCurrent}-${sortValueCurrent}`;
  }
}
// Hết Sắp xếp
