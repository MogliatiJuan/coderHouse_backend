import jwt from "jsonwebtoken";
import passport from "passport";

export const generateToken = (user) => {
  const { id, email, firstName, lastName, role, age } = user;
  const payload = { id, email, firstName, lastName, role, age };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const validateToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
      if (error) {
        return reject(error);
      }
      resolve(payload);
    });
  });
};

export const authMiddleware = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, function (error, payload, info) {
    if (error) return next(error);
    if (!payload)
      return res
        .status(401)
        .send({ message: info.message ? info.message : info.toString() });
    req.user = payload;
    next();
  })(req, res, next);
};

export const authRolesMiddleware = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).send({ message: "Unauthorized" });

  const { role: userRole } = req.user;
  if (userRole !== role) return res.status(403).send({ message: "Forbidden" });

  next();
};
