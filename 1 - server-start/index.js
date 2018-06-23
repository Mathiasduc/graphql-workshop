const { ApolloServer, gql } = require('apollo-server')

const movies = [
    {
        name: 'test',
    },
    {
        name: 'efdwde'
    }
]

const typeDefs = gql`
    type Query {
        movies: [movie]
    }

    type movie {
        id: ID,

    }
`


const server = new ApolloServer({
    typeDefs,
    resolvers:{}
})

server.listen().then(({url})=>console.log('ready on ,'+ url))
