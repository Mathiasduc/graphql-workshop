const { ApolloServer, gql } = require("apollo-server");
const Sequelize = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  `postgres://${process.env.USERNAME}:${process.env.PASSWORD}@ec2-54-247-100-44.eu-west-1.compute.amazonaws.com:5432/${process.env.DB}`,
    {
      ssl: true,
      dialectOptions: {
        ssl: true
      }
    }
  );
  
  const Framework = sequelize.define("frameworks", {
    name: {
      type: Sequelize.STRING
    },
    git: {
      type: Sequelize.STRING
    }
  });
  
  const typeDefs = gql`
  type Framework {
    id: String
    name: String
    git: String
  }
  
  type Query {
    frameworks: [Framework]
  }
  type Mutation {
    addFramework(name: String, git: String): Framework
  }
  `;
  
  const resolvers = {
    Query: {
      frameworks: () => Framework.findAll()
    },
    Mutation: {
      addFramework: async (_, { name, git })=> {
        try {
          const createdFramework = await Framework.create({ name, git });
          return createdFramework;
        } catch (error) {
          console.error(error);
          throw new Error(error);
        }
      }
    }
  };
  const server = new ApolloServer({ typeDefs, resolvers });
  
  sequelize.sync().then(()=>server.listen()).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
  