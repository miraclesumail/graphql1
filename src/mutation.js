const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('./utils')

module.exports =  {
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
    updateLink: (parent, args, context) => {
        return context.prisma.updateLink({
           data: {
               description: '对对对看看打开'
           },
           where: {
               id: args.id
           }
        })
    },
    async deleteLinks(parent, args, context){
         let info = await context.prisma.deleteManyLinks({id_in:args.id});
         console.log(info)
         return {count: info.count}
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
  }