// middleware/auth.js
// FIX: Role-based access control middleware

module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // Assume req.user is set after authentication (e.g., JWT or session)
    // For demo, allow role from req.headers['x-role'] if no auth system
    const userRole = req.user?.role || req.headers["x-role"];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
