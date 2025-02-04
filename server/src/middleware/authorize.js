const authorize = (model) => async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(id);

    if (currentUser.role === "admin") {
      return next();
    }

    if (model === "user") {
      if (id && id === currentUser.id) {
        return next();
      }
    }

    if (model) {
      console.log(model.name, id);
      const ressource = await model.findByPk(id);
      if (!ressource) {
        return res.status(404).json({ message: "Ressource not found." });
      }
      if (ressource.userId === currentUser.id) {
        return next();
      }
    }

    return res
      .status(403)
      .json({ message: "Forbidden: You do not have the required permission." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = authorize;
