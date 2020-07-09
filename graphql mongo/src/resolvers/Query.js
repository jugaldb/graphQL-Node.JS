import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
 
const Query= {
        users: () => User.find(),
        posts:()=>Post.find(),
        comments:()=>Comment.find()

    }
    


export {Query as default}