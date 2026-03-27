const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { StatusCodes } = require("http-status-codes");

const protect = (req,res,next) => {
    try{
      let token;
      // 🔹 Check if Authorization header exists
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        // Extract token
        token = req.headers.authorization.split(" ")[1];
      }
      // ❗ No token
      if (!token) {
        throw new AppError(
          "Not authorized, no token",
          StatusCodes.UNAUTHORIZED,
        );
      }

      // 🔹 Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // 🔹 Attach user to request
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
    }catch(err){
    next(
      new AppError(
        "Not authorized, token failed",
        StatusCodes.UNAUTHORIZED
      )
    );
    }
}


module.exports = protect;