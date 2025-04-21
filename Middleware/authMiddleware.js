const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // const token=req.header('Authorization')?.replace('Bearer','')
  const authHeader = req.header("Authorization");
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "no token:authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = decoded
    //{
    //   id: decoded._id,
    //   role: decoded.role,
    // };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: Unauthorized role' });
      }
      next();
    };
  };
module.exports = {authMiddleware,authorizeRoles}
