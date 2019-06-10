const { GraphQLServer } = require('graphql-yoga')
const bcrypt = require('bcryptjs')
const { prisma } = require('./generated/prisma-client')

const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('./utils')

let userList = [
    {id:'111', name:'dddddd'},
    {id:'222', name:'eeeeee'},
    {id:'333', name:'ffffff'}
]

// type Subscription {
//   newLink: Link
// }
// 1
const typeDefs = `

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
  links: [Link!]!
}
type Link {
  id: ID!
  description: String!
  url: String!
  postedBy: User
}
type AuthPayload {
  token: String
  user: User
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
  createUser(name: String!, email: String!): User!,
  signup(email: String!, password: String!, name: String!): AuthPayload
  login(email: String!, password: String!): AuthPayload
}
`

// 2
const resolvers = {
    Query: {
      info: () => `This is the API of a Hackernews Clone`,
      test: () => new Date().toLocaleTimeString(),
      users: (root, args, context) => context.prisma.users(),
      // args 是查询的参数
      user: (root, args, context) => {
        return context.prisma.user({
              id: args.id  
        })
      },
      feed: (root, args, context, info) => {
        return context.prisma.links()
      }
    },
    Mutation: {
      // 通过 getUserId(context) 获取当前的用户登录的用户信息
      post(parent, args, context) {
        console.log('金啦啦啦啦');
        const userId = getUserId(context)
        return context.prisma.createLink({
          url: args.url,
          description: args.description,
          postedBy: { connect: { id: userId } },
        })
      },
      createUser: (parent, args, context) => {
          return context.prisma.createUser({
            name: args.name,
            gender: args.email
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
      },
      async signup(parent, args, context, info) {
        console.log(context.name);
        const password = await bcrypt.hash(args.password, 10)     
        const user = await context.prisma.createUser({ ...args, password })
        const token = jwt.sign({ userId: user.id }, APP_SECRET)
        return {
          token,
          user
        }
      },
      // 登录的password设置为常规
      async login(parent, args, context, info) {
        console.log(await context.prisma.users({where:{ email: args.email }}));
        const user = (await context.prisma.users({where:{ email: args.email }}))[0];
        if (!user) {
          throw new Error('No such user found')
        }
        const valid = await bcrypt.compare(args.password, user.password)
        if (!valid) {
          throw new Error('Invalid password')
        } 
        const token = jwt.sign({ userId: user.id }, APP_SECRET)
        return {
          token,
          user
        }
      }
    },
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
    typeDefs,
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