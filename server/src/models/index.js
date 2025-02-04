const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "creator" });

Comment.belongsTo(User, { foreignKey: "userId", as: "creator" });
Comment.belongsTo(Post, { foreignKey: "postId" });
Comment.belongsTo(Comment, {
  foreignKey: "parentCommentId",
  as: "parentComment",
});

module.exports = { User, Post, Comment };
