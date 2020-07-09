import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";

const Subscription = {
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info){
            const post = Post.findById(postId)

            if (!post) {
                throw new Error('Post not found')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post')
        }
    }
}

export { Subscription as default }