import { User } from "../models/User";
// import { Post } from "../models/Post";
import { Comment } from "../models/Comment";



const Post = {
    author:async(parent, args, ctx, info)=>{
        const user = await User.findById({_id:parent.author})
        console.log(user)
        return user
        // return db.users.find((user) => {
        //     return user.id === parent.author
        // })
    },
    comments:async(parent, args, ctx, info)=>{
        const comments = await Comment.find({post:parent.id})
        return comments
        // return db.comments.filter((comment) => {
        //     return comment.post === parent.id
        // })
    }
}

export { Post as default }