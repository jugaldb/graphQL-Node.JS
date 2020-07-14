import { User } from "../models/User";
import { Post } from "../models/Post";
// import { Comment } from "../models/Comment";

const Comment = {
	author(parent, args, ctx, info) {
		const user = User.findById({ _id: parent.id });
		return user;
		// return db.users.find((user) => {
		//     return user.id === parent.author
		// })
	},
	post(parent, args, ctx, info) {
		const post = Post.findById({ _id: parent.post });
		return post;
		// return db.posts.find((post) => {
		//     return post.id === parent.post
		// })
	},
};

export { Comment as default };
