module.exports = (req, res, next) => {
  if (!req.user || req.user.UserRole !== 'User') {
    return res.status(403).json({ message: 'Forbidden: Users only' });
  }
  next();
}; 