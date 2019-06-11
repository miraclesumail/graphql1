const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const Query = require('./query')
const Mutation = require('./mutation')
// 2
const resolvers = {
    Query,
    Mutation,
    // Subscription: {
    //   newLink: {
    //     subscribe: (parent, args, context, info) => {
    //       return context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node()
    //     },
    //     resolve: payload => {
    //       return payload
    //     }
    //   } 
    // },
    // 修改返回结果
    Link: {
      id: (parent) => parent.id,
      description: (parent) => parent.description,
      url: (parent) => parent.url + 'aoxososo',
      postedBy: (parent, args, context) => {
        return context.prisma.link({ id: parent.id }).postedBy()
      } 
    },
    User: {
      links: (parent, args, context) => {
        return context.prisma.user({ id: parent.id }).links()
      }
    }   
  }
  
  // 3
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context:  request => {
      return {
        ...request,
        prisma,
        name:'wwwwwwwwww'
      }
    }
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