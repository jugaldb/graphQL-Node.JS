import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
import getUserId from "../utils/getUserId";


const Query = {
	users: async (parent, args, {request}, info) => {
        const userId = getUserId(request)
		const users = await User.find();
		return users;
	},
	posts: async (parent, args, ctx, info) => {
        const posts = Post.find();
        return posts
	},
	comments:async (parent, args, ctx, info) => {
        const comments = await Comment.find()
        return comments
    },
    login:async(_,{email,password})=>{
        const user = await User.findOne({email})
        if(!user){
            throw new Error('User does not exist')    
        }
        const verify= await bcrypt.compare(password,user.password)
        if(!verify){
            throw new Error('Password is incorrect')
        }
        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{
            expiresIn:'1h'
        })
        return {user,token,tokenExpiration:1}
    },
    async me(parent,args,{request},info){
        const userId = getUserId(request)
        const me = await User.findById(userId)

        return user
    },
    async post(parent,args,{request},info){
        const userId = getUserId(request)
        const post = await Post.findById(args.id)

        return post
        
    }
};

export { Query as default };
