const userService = require("../services/userService");

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const update = await userService.updateUser(
      req.params.id,
      req.body,
      req.user
    );
    if (!update) {
      return res.status(404).json({ message: "User not found" });
    }

    const { user, hasBeenUpdated } = update;
    let message = hasBeenUpdated
      ? "Successfully updated."
      : "No changes were made.";
    res.json({ user, message });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
