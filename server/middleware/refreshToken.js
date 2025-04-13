import jwt from "jsonwebtoken";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const refreshToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if token is close to expiring, generate new token and set cookie
    const tokenExp = decoded.exp * 1000; 
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (tokenExp - now < fiveMinutes) {
      // new token
      generateTokenAndSetCookie(res, decoded.id);
    }

    next();
  } catch (error) {
    next();
  }
};
