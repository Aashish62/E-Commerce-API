import jwt from 'jsonwebtoken';
import models from '../models/index.js';
const { User } = models;

export const verifyToken = async (req, res, next) => {
  try {
    // Accept lowercase or uppercase header
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing. Use 'Authorization: Bearer <token>'" });
    }

   const token = authHeader.replace("Bearer ", "");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ message: "User not found (invalid token)" });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
};
