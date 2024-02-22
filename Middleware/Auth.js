const jwt = require("jsonwebtoken");
const User = require("../components/models/user");

const protect = async ({ req, res }) => {
  // console.log(context)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token" });
      }

      // const data = {
      //   loginstatus: login,
      // }
      req.isLogin = true
      req.user
      return
    } catch (error) {
      throw new Error("Not authorized, token failed");
    }
  } else {
    throw new Error("Not authorized, no token");
  }
};

// module.exports = { protect };
module.exports = protect;
