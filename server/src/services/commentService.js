const { User, Comment } = require("../models");

const addComment = async (data) => {
  try {
    const comment = await Comment.create(data);
    return comment;
  } catch (error) {
    throw new Error("Error creating comment");
  }
};

const getComments = async (postId, parentCommentId = null) => {
  try {
    const comments = await Comment.findAll({
      where: {
        postId,
        parentCommentId: parentCommentId,
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["username", "avatar"],
        },
        { model: Comment, as: "parentComment" },
      ],
      order: [["createdAt", "ASC"]],
    });
    return comments;
  } catch (error) {
    throw new Error("Error fetching comments");
  }
};

const editComment = async (commentId, content) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");
    comment.content = content;
    await comment.save();
    return comment;
  } catch (error) {
    throw new Error("Error updating comment");
  }
};

const deleteComment = async (commentId) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");
    await comment.destroy();
    return { message: "Comment deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting comment");
  }
};

module.exports = {
  addComment,
  getComments,
  editComment,
  deleteComment,
};
