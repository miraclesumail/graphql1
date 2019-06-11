
module.exports =  {
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
    },
    getLinkByUrl: (root, args, context) => {
        return context.prisma.links({
            where: {url: args.url}
        })
    }
  }