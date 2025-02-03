const { Post } = require("../models");

const authorize = (model) => async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;

    if (currentUser.role === "admin") {
      return next();
    }

    if (model === "user") {
      if (id && id === currentUser.id) {
        return next();
      }
    }

    if (model === "post") {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
      if (post.userId === currentUser.id) {
        return next();
      }
    }

    return res
      .status(403)
      .json({ message: "Forbidden: You do not have the required permission." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = authorize;
