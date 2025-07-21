// Phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const dataFinal = [];

    const listElementRoleId = document.querySelectorAll("[role-id]");
    listElementRoleId.forEach((elementRoleId) => {
      const roleId = elementRoleId.getAttribute("role-id");

      const permissions = [];

      const listInputChecked = document.querySelectorAll(
        `input[data-id="${roleId}"]:checked`
      );

      listInputChecked.forEach((input) => {
        const tr = input.closest(`tr[data-name]`);
        const name = tr.getAttribute("data-name");
        permissions.push(name);
      });

      dataFinal.push({
        id: roleId,
        permissions: permissions,
      });
    });

    //gửi dữ liệu lên server bằng api
    const path = buttonSubmit.getAttribute("data-path");

    fetch(path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(dataFinal),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          location.reload();
        }
      });

    //gửi dữ liệu lên server bằng form
    // if(dataFinal.length > 0) {
    //   const formChangePermissions = document.querySelector('#form-change-permissions');
    //   const inputPermissions = formChangePermissions.querySelector('input[name="permissions"]');
    //   inputPermissions.value = JSON.stringify(dataFinal);
    //   formChangePermissions.submit();
    // }
  });

  // Hiển thị mặc định
  let dataPermissions = tablePermissions.getAttribute("table-permissions");
  dataPermissions = JSON.parse(dataPermissions);
  dataPermissions.forEach((item) => {
    item.permissions.forEach((permission) => {
      const input = document.querySelector(
        `tr[data-name="${permission}"] input[data-id="${item._id}"]`
      );
      input.checked = true;
    });
  });
}
// Hết Phân quyền
