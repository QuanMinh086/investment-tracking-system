module.exports = (role) => (req, res, next) => {
  if (!req.user || req.user.UserRole !== role) {
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
  }
  next();
}; 