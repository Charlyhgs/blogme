const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get("/:id", userController.getUser);
router.get("/", userController.getAllUsers);
router.put(
  "/:id",
  authMiddleware.authenticate,
  authorize("user"),
  userController.updateUser
);

router.delete(
  "/:id",
  authMiddleware.authenticate,
  authorize("user"),
  userController.deleteUser
);

module.exports = router;
