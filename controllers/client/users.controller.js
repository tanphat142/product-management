const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

const usersSocket = require("../../sockets/client/users.socket");

module.exports.notFriend = async (req, res) => {
  usersSocket(req, res);

  const userIdA = res.locals.user.id;
  const friendsList = res.locals.user.friendsList;
  const friendsListId = friendsList.map((item) => item.userId);

  const users = await User.find({
    $and: [
      { _id: { $ne: userIdA } }, // $ne: not equal
      { _id: { $nin: res.locals.user.requestFriends } }, // $nin: not in
      { _id: { $nin: res.locals.user.acceptFriends } }, // $nin: not in
      { _id: { $nin: friendsListId } }, // $nin: not in
    ],
    deleted: false,
    status: "active",
  }).select("id fullName avatar");

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

module.exports.request = async (req, res) => {
  usersSocket(req, res);

  const users = await User.find({
    _id: { $in: res.locals.user.requestFriends },
    deleted: false,
    status: "active",
  }).select("id fullName avatar");

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users,
  });
};

module.exports.accept = async (req, res) => {
  usersSocket(req, res);

  const users = await User.find({
    _id: { $in: res.locals.user.acceptFriends },
    deleted: false,
    status: "active",
  }).select("id fullName avatar");

  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời đã nhận",
    users: users,
  });
};

module.exports.friends = async (req, res) => {
  const friendsList = res.locals.user.friendsList;

  const users = [];

  for (const user of friendsList) {
    const infoUser = await User.findOne({
      _id: user.userId,
      deleted: false,
      status: "active",
    });

    users.push({
      id: infoUser.id,
      fullName: infoUser.fullName,
      avatar: infoUser.avatar,
      statusOnline: infoUser.statusOnline,
      roomChatId: user.roomChatId,
    });
  }

  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};

module.exports.rooms = async (req, res) => {
  const listRoomChat = await RoomChat.find({
    "users.userId": res.locals.user.id,
    typeRoom: "group",
    deleted: false,
  });

  res.render("client/pages/users/rooms", {
    pageTitle: "Phòng chat",
    listRoomChat: listRoomChat,
  });
};

module.exports.createRoom = async (req, res) => {
  const friendsList = res.locals.user.friendsList;

  const friendsListFinal = [];

  for (const friend of friendsList) {
    const infoFriend = await User.findOne({
      _id: friend.userId,
      deleted: false,
    });

    if (infoFriend) {
      friendsListFinal.push({
        userId: friend.userId,
        fullName: infoFriend.fullName,
      });
    }
  }

  res.render("client/pages/users/create-room", {
    pageTitle: "Tạo phòng chat",
    friendsList: friendsListFinal,
  });
};

module.exports.createRoomPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;

  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: [],
  };

  dataRoom.users.push({
    userId: res.locals.user.id,
    role: "superAdmin",
  });

  for (const userId of usersId) {
    dataRoom.users.push({
      userId: userId,
      role: "user",
    });
  }

  const room = new RoomChat(dataRoom);
  await room.save();

  res.redirect(`/chat/${room.id}`);
};
