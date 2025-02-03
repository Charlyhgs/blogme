const express = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post("/", authMiddleware.authenticate, postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.get("/user/:userId", postController.getPostByUserId);

router.put(
  "/:id",
  authMiddleware.authenticate,
  authorize("post"),
  postController.updatePost
);
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authorize("post"),
  postController.deletePost
);

module.exports = router;
