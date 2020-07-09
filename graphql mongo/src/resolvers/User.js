// import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";

const User = {
    posts:async(parent, args,ctx, info)=>{
        const posts = await Post.find({author:parent.id})
        return posts
        // return db.posts.filter((post) => {
        //     return post.author === parent.id
        // })
    },
    comments:async(parent, args, ctx, info)=> {
        const comments = await Comment.find({author:parent.id})
        return comments
        // return db.comments.filter((comment) => {
        //     return comment.author === parent.id
        // })
    }
}

export { User as default }