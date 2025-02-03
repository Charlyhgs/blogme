const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", userController.getUser);
router.get("/", userController.getAllUsers);
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRolesOrSelf("admin"),
  userController.updateUser
);

router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRolesOrSelf("admin"),
  userController.deleteUser
);

module.exports = router;
