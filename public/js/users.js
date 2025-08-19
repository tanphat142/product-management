// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-add-friend");

      button.closest(".box-user").classList.add("add");

      socket.emit("CLIENT_ADD_FRIEND", userIdB);
    });
  });
}
// Hết Chức năng gửi yêu cầu

// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-cancel-friend");

      button.closest(".box-user").classList.remove("add");

      socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
    });
  });
}
// Hết Chức năng hủy gửi yêu cầu

// Chức năng từ chối kết bạn
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    const userIdB = button.getAttribute("btn-refuse-friend");

    button.closest(".box-user").classList.add("refuse");

    socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
  });
};

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    refuseFriend(button);
  });
}
// Hết Chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    const userIdB = button.getAttribute("btn-accept-friend");

    button.closest(".box-user").classList.add("accepted");

    socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
  });
};

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    acceptFriend(button);
  });
}
// Hết Chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
  const badgeUserAccept = document.querySelector(
    `[badge-user-accept="${data.userIdB}"]`
  );
  if (badgeUserAccept) {
    badgeUserAccept.innerHTML = data.length;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIENDS

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIENDS", (data) => {
  // Thêm A vào danh sách lời mời đã nhận của B
  const listAcceptFriends = document.querySelector(
    `[list-accept-friends="${data.userIdB}"]`
  );
  if (listAcceptFriends) {
    const newUser = document.createElement("div");
    newUser.classList.add("col-6");
    newUser.setAttribute("user-id", data.userIdA);
    newUser.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img src="https://robohash.org/hicveldicta.png" alt="${data.fullNameA}" />
        </div>
        <div class="inner-info">
          <div class="inner-name">${data.fullNameA}</div>
          <div class="inner-buttons">
            <button 
              class="btn btn-sm btn-primary mr-1"
              btn-accept-friend="${data.userIdA}"
            >
              Chấp nhận
            </button>
            <button
              class="btn btn-sm btn-secondary mr-1"
              btn-refuse-friend="${data.userIdA}"
            >
              Xóa
            </button>
            <button 
              class="btn btn-sm btn-secondary mr-1" 
              btn-deleted-friend="" 
              disabled=""
            >
              Đã xóa
            </button>
            <button 
              class="btn btn-sm btn-primary mr-1" 
              btn-accepted-friend="" 
              disabled=""
            >
              Đã chấp nhận
            </button>
          </div>
        </div>
      </div>
    `;

    listAcceptFriends.appendChild(newUser);

    // Chấp nhận kết bạn
    const btnAcceptFriend = newUser.querySelector("[btn-accept-friend]");

    acceptFriend(btnAcceptFriend);

    // Không chấp nhận kết bạn
    const btnRefuseFriend = newUser.querySelector("[btn-refuse-friend]");

    refuseFriend(btnRefuseFriend);
  }

  // Xóa A khỏi danh sách người dùng của B
  const listNotFriends = document.querySelector(
    `[list-not-friends="${data.userIdB}"]`
  );
  if (listNotFriends) {
    const userA = listNotFriends.querySelector(`[user-id="${data.userIdA}"]`);
    if (userA) {
      listNotFriends.removeChild(userA);
    }
  }
});
// End SERVER_RETURN_INFO_ACCEPT_FRIENDS

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  // userIdB để tìm vào danh sách của B
  // userIdA để xóa A khỏi giao diện của B

  const listAcceptFriends = document.querySelector(
    `[list-accept-friends="${data.userIdB}"]`
  );
  if (listAcceptFriends) {
    const userA = listAcceptFriends.querySelector(
      `[user-id="${data.userIdA}"]`
    );
    if (userA) {
      listAcceptFriends.removeChild(userA);
    }
  }
});
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_STATUS_ONLINE_USER
socket.on("SERVER_RETURN_STATUS_ONLINE_USER", (data) => {
  const listFriend = document.querySelector("[list-friend]");
  if(listFriend) {
    const user = listFriend.querySelector(`[user-id="${data.userId}"]`);
    if(user) {
      const status = user.querySelector("[status]");
      status.setAttribute("status", data.statusOnline);
    }
  }
})
// End SERVER_RETURN_STATUS_ONLINE_USER
