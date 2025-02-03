const { User } = require("../models");

const createUser = async (data) => {
  try {
    return await User.create(data);
  } catch (error) {
    console.log(error);
    throw new Error("Database error while creating user");
  }
};

const getUserById = async (id) => {
  try {
    return await User.findByPk(id);
  } catch (error) {
    throw new Error("Database error while fetching user");
  }
};

const getUserByProviderId = async (providerId) => {
  try {
    return await User.findOne({ where: { providerId } });
  } catch (error) {
    throw new Error("Database error while fetching user");
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    throw new Error("Database error while fetching users");
  }
};

const getAllUsers = async () => {
  try {
    return await User.findAll();
  } catch (error) {
    throw new Error("Database error while fetching users");
  }
};

const updateUser = async (id, updates) => {
  try {
    const [affectedRows] = await User.update(updates, { where: { id } });
    if (affectedRows === 0) return null;

    return await User.findByPk(id);
  } catch (error) {
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
