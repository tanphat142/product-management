const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/users.controller");

const userMiddleware = require("../../middlewares/client/user.middleware");

router.get(
  "/not-friend",
  userMiddleware.requireAuth,
  controller.notFriend
);

router.get(
  "/request",
  userMiddleware.requireAuth,
  controller.request
);

router.get(
  "/accept",
  userMiddleware.requireAuth,
  controller.accept
);

router.get(
  "/friends",
  userMiddleware.requireAuth,
  controller.friends
);

router.get(
  "/rooms",
  userMiddleware.requireAuth,
  controller.rooms
);

router.get(
  "/rooms/create",
  userMiddleware.requireAuth,
  controller.createRoom
);

router.post(
  "/rooms/create",
  userMiddleware.requireAuth,
  controller.createRoomPost
);

module.exports = router;