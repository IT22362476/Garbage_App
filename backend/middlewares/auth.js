// middleware/auth.js
// FIX: Role-based access control middleware

module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // SECURITY FIX: Remove dangerous header fallback - only use authenticated user
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRole = req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
