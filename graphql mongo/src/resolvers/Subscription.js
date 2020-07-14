import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import getUserId from "../utils/getUserId";

const Subscription = {
	comment: {
		subscribe(parent, { postId }, { db, pubsub, request }, info) {
			const userId = getUserId(request)
			const post = Post.findById(postId);
			// const userId = getUserId(request)

			// if(post.author!=userId){
			//     throw new Error('This is not your post, you cant subscribe to the comments')
			// }

			if (!post) {
				throw new Error("Post not found");
			}

			return pubsub.asyncIterator(`comment ${postId}`);
		},
	},
	post: {
		subscribe(parent, args, { pubsub }, info) {
			return pubsub.asyncIterator("post");
		},
	},
};

export { Subscription as default };
