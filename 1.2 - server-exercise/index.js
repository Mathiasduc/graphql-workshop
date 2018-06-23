const { ApolloServer, gql } = require("apollo-server");

const frameworks = [
  {
    title: "React",
    git: "https://github.com/facebook/react/",
    stars: 104170
  },
  {
    title: "Vue",
    git: "https://github.com/vuejs/vue/",
    stars: 104483  
  }
];


const typeDefs = gql`
  type Query {
      frameworks: [framework]
      framework(title: String): framework
  }

  type framework {
      title: String,
      git: String,
      stars: Int,
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers:{
    Query:{
      frameworks: () => frameworks,
      framework: (_,{title})=> frameworks.find(x => x.title === title)
    }
  }
})

server.listen().then(({url})=>console.log('ready on ,'+ url))
