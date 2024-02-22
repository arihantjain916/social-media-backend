const { ApolloServer } = require("apollo-server-express");
const dotenv = require("dotenv");
const typeDefs = require("./components/graphql/typeDefs");
const resolvers = require("./components/graphql/resolvers");
const express = require("express");
const app = express();
const connectDB = require("./components/db/conn");
const port = 4000 || process.env.PORT;
dotenv.config();

app.use("/", (req, res) => {
  res.send("Welcome to The Thought Leadership API!");
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running at http://localhost:${port}`);
  });
});
