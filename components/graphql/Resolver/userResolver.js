const generateToken = require("../../../utils/generateToken");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const Post = require("../../models/post");
const Like = require("../../models/like");
const Comment = require("../../models/comment");
const Follow = require("../../models/follow");
const Protect = require("../../../Middleware/Auth")

const UserResolver = {
  Query: {
    async getUser(_, { ID }) {
      const user = await User.findById(ID).populate("posts").populate("likes");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
  },
  Mutation: {
    async registerUser(_, { userInput: { name, email, username, password } }) {
      const userfind = await User.findOne({ email: email });
      const usernamefind = await User.findOne({ username: username });
      if (userfind) {
        throw new Error(
          "User Already Register"
        );
      }
      if (usernamefind) {
        throw new Error(
          "Username Already Register"
        );
      }
      const hashPass = await bcrypt.hash(password, 10);
      if (!hashPass) {
        throw new Error(error);
      }

      const user = new User({
        name: name,
        email: email,
        username: username,
        password: hashPass,
      });
      await user.save();
      const token = generateToken(user._id);

      return {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
        token: token,
      };
    },
    async loginUser(_, { userInput }) {
      const user = await User.findOne({ email: userInput.email });
      if (!user) {
        throw new Error(
          "Auth failed!! either the account does't exist or you have enter invalid email id"
        );
      }

      const isPass = await bcrypt.compare(userInput.password, user.password);
      if (!isPass) {
        throw new Error("Auth Fail!!!");
      }

      const token = generateToken(user._id);
      return {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        token: token,
      };
    },
    async deleteUser(_, { ID }, context) {
      if (!context.req.isLogin) {
        throw new Error("You must be logged in to delete a user");
      }
      console.log(context.data)
      const user = await User.findById(ID);
      if (!user) {
        throw new Error("No User found");
      }

      const deleted = (await User.deleteOne({ _id: ID })).deletedCount;
      if (deleted) {
        await Comment.deleteMany({ user_id: ID });
        await Like.deleteMany({ user_id: ID });
        await Post.deleteMany({ user_id: ID });
        await Follow.deleteMany({ follower_id: ID });
        return deleted;
      } else {
        throw new Error("Deleted unsuccessful");
      }
    }
  },
};

module.exports = UserResolver;
