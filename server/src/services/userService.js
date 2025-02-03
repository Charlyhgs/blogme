const User = require("../models/User");
const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  return password ? await bcrypt.hash(password, 10) : null;
};

const isUnauthorizedUpdate = (updates, requesterRole) => {
  return updates.role && requesterRole !== "admin";
};

const createUser = async (data) => {
  data.password = await hashPassword(data.password);
  return User.create(data);
};

const getUserById = async (id) => {
  return User.findByPk(id);
};

const getUserByProviderId = async (providerId) => {
  return User.findOne({ where: { providerId } });
};

const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const getAllUsers = async () => {
  return User.findAll();
};

const updateUser = async (id, updates, requester) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    if (isUnauthorizedUpdate(updates, requester.role)) {
      console.log("Unauthorized role change attempt.");
      return { user, hasBeenUpdated: false };
    }

    const changesMade = Object.keys(updates).some(
      (key) => updates[key] !== user[key] && key !== "password"
    );

    if (!changesMade) return { user, hasBeenUpdated: false };

    const [affectedRows] = await User.update(updates, { where: { id } });
    if (affectedRows === 0) return { user, hasBeenUpdated: false };

    return { user: await User.findByPk(id), hasBeenUpdated: true };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Database error while updating user");
  }
};

const deleteUser = async (id) => {
  try {
    const affectedRows = await User.destroy({ where: { id } });
    return affectedRows > 0;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Database error while deleting user");
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByProviderId,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
};
