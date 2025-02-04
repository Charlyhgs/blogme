const commentService = require("../services/commentService");

const addComment = async (req, res) => {
  try {
    const data = { ...req.body };
    data.postId = req.params.postId;
    data.userId = req.user.id;
    data.parentCommentId = req.params.commentId || null;
    const comment = await commentService.addComment(data);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { parentCommentId } = req.query;
    const comments = await commentService.getComments(postId, parentCommentId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await commentService.editComment(id, content);
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await commentService.deleteComment(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComments,
  editComment,
  deleteComment,
};
