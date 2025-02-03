const postService = require("../services/postService");

const createPost = async (req, res) => {
  try {
    const data = req.body;
    data.userId = req.user.id;
    const post = await postService.createPost(data);
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: "Error creating post" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching post" });
  }
};

const getPostByUserId = async (req, res) => {
  try {
    const posts = await postService.getPostByUserId(req.params.userId);
    if (!posts.length)
      return res.status(404).json({ message: "Posts not found" });

    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching posts" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    if (!posts.length)
      return res.status(404).json({ message: "No posts found." });

    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching posts" });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const updates = { ...req.body };

    const changesMade = Object.keys(updates).some(
      (key) => updates[key] !== post[key]
    );

    if (!changesMade)
      return res.json({ post, message: "No changes were made." });

    const updatedPost = await postService.updatePost(req.params.id, updates);
    if (!updatedPost)
      return res.status(500).json({ message: "Failed to update post." });

    return res.json({ post: updatedPost, message: "Successfully updated." });
  } catch (error) {
    return res.status(500).json({ message: "Error updating post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const deleted = await postService.deletePost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json({ message: "Post successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting post" });
  }
};

module.exports = {
  createPost,
  getPostById,
  getPostByUserId,
  getAllPosts,
  updatePost,
  deletePost,
};
