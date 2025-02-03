const { Post, User } = require("../models");

const createPost = async (data) => {
  try {
    return await Post.create(data);
  } catch (error) {
    throw new Error("Database error while creating post");
  }
};

const getPostById = async (id) => {
  try {
    return await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["username", "avatar"],
        },
      ],
    });
  } catch (error) {
    throw new Error("Database error while fetching post");
  }
};

const getPostByUserId = async (userId) => {
  try {
    return await Post.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["username", "avatar"],
        },
      ],
    });
  } catch (error) {
    throw new Error("Database error while fetching posts");
  }
};

const getAllPosts = async () => {
  try {
    return await Post.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["username", "avatar"],
        },
      ],
    });
  } catch (error) {
    throw new Error("Database error while fetching posts");
  }
};

const updatePost = async (id, updates) => {
  try {
    const [affectedRows] = await Post.update(updates, { where: { id } });
    if (affectedRows === 0) return null;
    return await Post.findByPk(id);
  } catch (error) {
    throw new Error("Database error while updating post");
  }
};

const deletePost = async (id) => {
  try {
    const affectedRows = await Post.destroy({ where: { id } });
    return affectedRows > 0;
  } catch (error) {
    console.log(error);
    throw new Error("Database error while deleting post");
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
