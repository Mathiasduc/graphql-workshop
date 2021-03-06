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
Framework.sync();

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

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
    removeFramework(id: Int): Framework
  }
`;

const resolvers = {
  Query: {
    frameworks: () => Framework.findAll()
  },
  Mutation: {
    addFramework: async (_, { name, git }) => {
      try {
        const framework = await Framework.create({
          name,
          git
        });

        return framework;
      } catch (e) {
        throw new Error(e);
      }
    },
    async removeFramework(_, {id}){
      try {
        const framework = await Framework.findById(id)
        await framework.destroy();
        return framework
      } catch (error) {
        console.error(error);
        throw error
      }
    }
  }
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
