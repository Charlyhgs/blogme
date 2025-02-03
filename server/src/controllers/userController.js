const userService = require("../services/userService");
const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  return password ? await bcrypt.hash(password, 10) : null;
};

const isUnauthorizedUpdate = (updates, requesterRole) => {
  return updates.role && requesterRole !== "admin";
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving users", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    if (isUnauthorizedUpdate(updates, req.user.role)) {
      return res
        .status(403)
        .json({ message: "Unauthorized role change attempt." });
    }

    const changesMade = Object.keys(updates).some(
      (key) => updates[key] !== user[key] && key !== "password"
    );

    if (!changesMade) {
      return res.json({ user, message: "No changes were made." });
    }

    // Apply changes
    const updatedUser = await userService.updateUser(req.params.id, updates);
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user." });
    }

    return res.json({ user: updatedUser, message: "Successfully updated." });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
