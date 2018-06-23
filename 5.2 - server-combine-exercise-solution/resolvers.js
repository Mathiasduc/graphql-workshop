const axios = require("axios");
const Sequelize = require("sequelize");
require("dotenv").config();


const sequelize = new Sequelize(
 `postgres://${process.env.USERNAME}:${process.env.PASSWORD}@ec2-23-23-247-245.compute-1.amazonaws.com:5432/${
    process.env.DB}`,
  'postgres://vynarmqiagqdch:62c6310f98ad3551d553861dca255861aa9427282628440b78567c148ec302b8@ec2-54-247-100-44.eu-west-1.compute.amazonaws.com:5432/daepo26h4s9o1p', 
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
  },
  stars: { type: Sequelize.INTEGER, defaultValue: 0 },
  description: { type: Sequelize.STRING, defaultValue: "" },
  avatar: { type: Sequelize.STRING, defaultValue: "" }
});

// When changing the DB you will need to run this with force true that will clean the DB and add the new coloumns
// Framework.sync({ force: true });
Framework.sync();

module.exports = {
  Query: {
    frameworks: () => Framework.findAll()
  },
  Mutation: {
    addFramework: async (_, { name, git }) => {
      try {
        const url = git.split("https://github.com/")[1];
        const { data } = await axios(`https://api.github.com/repos/${url}`);
        const { stargazers_count, description } = data;
        const { owner : avatar_url } = data
        // data is at:
        // description: gh.data.description,
        //  avatar: gh.data.owner.avatar_url
console.log(avatar_url, description);

        const framework = await Framework.create({
          name,
          git,
          stars: stargazers_count,
          description,
          avatar: avatar_url,
        });

        return framework;
      } catch (e) {
        console.error(e)
        throw new Error(e);
      }
    }
  }
};
