const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403);
      throw new Error('Not authorized as master user');
    }
  };
};

export default checkRole;