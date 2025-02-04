const express = require("express");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { Comment } = require("../models");

const router = express.Router();

router.post(
  "/:postId/:commentId?",
  authMiddleware.authenticate,
  commentController.addComment
);

router.get("/:postId", commentController.getComments);

router.put(
  "/:id",
  authMiddleware.authenticate,
  authorize(Comment),
  commentController.editComment
);

router.delete(
  "/:id",
  authMiddleware.authenticate,
  authorize(Comment),
  commentController.deleteComment
);

module.exports = router;
