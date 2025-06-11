import jwt from "jsonwebtoken";
import config from "../config/index.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt_secret, {
    expiresIn: "7d",
  });
};

export default generateToken;
