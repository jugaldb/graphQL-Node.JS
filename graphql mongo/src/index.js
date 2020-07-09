import { ApolloServer, gql } from "apollo-server-express";
const { GraphQLServer } = require('graphql-yoga');
import express from "express";
import mongoose from "mongoose";
import { resolvers } from "./resolvers";



mongoose.connect("mongodb+srv://jugal:Learning@cluster0.l8i2j.mongodb.net/graphQL?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology:true
});

// const startServer = async () => {
//   const app = express();

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers
//   });

  // server.applyMiddleware({ app });


  // app.listen({ port: 4000 }, () =>
  //   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  // );
// };

const server = new GraphQLServer({
  typeDefs:'./src/schema.graphql',
  resolvers
})

server.start( () => console.log(`🚀 Server ready at http://localhost:4000`))

// startServer();
