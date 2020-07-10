import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Query = {
	users: async (parent, args, ctx, info) => {
		const users = await User.find(opArgs);
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
        const token = jwt.sign({user},process.env.JWT_SECRET,{
            expiresIn:'1h'
        })
        return {user,token,tokenExpiration:1}
    }
};

export { Query as default };
