const { GraphQLServer } = require('graphql-yoga')

const { prisma } = require('./generated/prisma-client')

let userList = [
    {id:'111', name:'dddddd'},
    {id:'222', name:'eeeeee'},
    {id:'333', name:'ffffff'}
]


// 1
const typeDefs = `
type User {
  id: ID!
  name: String!
  gender: String!
}
type Link {
  id: ID!
  description: String!
  url: String!
}
type Query {
  info: String!,
  test: String,
  users: [User]!,
  user(id:ID!): User,
  feed: [Link!]!
}
type Mutation {
  post(url: String!, description: String!): Link!,
  updateLink(id: ID!, description: String!): Link!,
  createUser(name: String!, gender: String!): User!
}
`

// 2
const resolvers = {
    Query: {
      info: () => `This is the API of a Hackernews Clone`,
      test: () => new Date().toLocaleTimeString(),
      users: (root, args, context) => context.prisma.users(),
      // args 是查询的参数
      user: (root, args) => {console.log(args, root); return {gender:'ggg', name:'vvvvvv'}},
      feed: (root, args, context, info) => {
        //prisma.updateLink
        return context.prisma.links()
      }
    },
    Mutation: {
      post: (parent, args, context) => {
          return context.prisma.createLink({
            url: args.url,
            description: args.description
          })
      },
      createUser: (parent, args, context) => {
          return context.prisma.createUser({
            name: args.name,
            gender: args.gender
          })
      },
      updateLink: (parent, args) => {
          return prisma.updateLink({
             data: {
                 description: '对对对看看打开'
             },
             where: {
                 id: args.id
             }
          })
      }
    },
    // 修改返回结果
    Link: {
      id: (parent) => parent.id,
      description: (parent) => parent.description,
      url: (parent) => parent.url + 'aoxososo'
    }
  }
  
  // 3
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: { prisma }
  })
  server.start(() => console.log(`Server is running on http://localhost:4000`))

// async function main() {
//   // Create a new link
//   const newLink = await prisma.createLink({ 
//     url: 'www.prisma.io',
//     description: 'Prisma replaces traditional ORMs',
//   })
//   console.log(`Created new link: ${newLink.url} (ID: ${newLink.id})`)

//   // Read all links from the database and print them to the console
//   const allLinks = await prisma.links()
//   console.log(allLinks)
// }

// main().catch(e => console.error(e))