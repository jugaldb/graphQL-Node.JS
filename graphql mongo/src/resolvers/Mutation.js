import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/User";

const Mutation = {
	createUser: async (_, { data }) => {
		const emailTaken = await User.find({ email: data.email });
		console.log(emailTaken);
		if (emailTaken.length >= 1) {
			throw new Error("Email already taken");
		}
		const { name, email, age } = data;
		const user = new User({ name, email, age });
		await user.save();
		return user;
	},
	updateUser: async (_, { id, data }) => {
		const user = await User.findById(id);

		if (!user) {
			throw new Error("User not found");
		}

		if (typeof data.email === "string") {
			const emailTaken = await User.find({ email: data.email });
			console.log(emailTaken);
			if (emailTaken.length >= 1) {
				throw new Error("Email already taken");
			}

			user.email = data.email;
		}

		if (typeof data.name === "string") {
			user.name = data.name;
		}

		if (typeof data.age !== "undefined") {
			user.age = data.age;
		}
		await user.save();

		return user;
	},
	deleteUser: async (_, { id }) => {
		const user = await User.findById(id);

        await Post.deleteMany({author:id})
        await Comment.deleteMany({author:id})
		if (!user) {
			throw new Error("User Doesnt Exist");
		}

		await user.remove();

		return user;
	},
	createPost: async (parent, args, { pubsub }, info) => {
		const userExists = await User.find({ _id: args.data.author});

		if (userExists.length === 0) {
			throw new Error("User not found");
		}

		const post = await new Post({
			...args.data,
		});

		await post.save();

		if (args.data.published) {
			pubsub.publish("post", {
				post: {
					mutation: "CREATED",
					data: post,
				},
			});
		}

		return post;
	},
	deletePost: async (parent, args, { pubsub }, info) => {
		const post = await Post.findById(args.id);

		if (!post) {
			throw new Error("Post does not exist");
		}

        await post.remove();
        await Comment.deleteMany({post:args.id})

		if (post.published) {
			pubsub.publish("post", {
				post: {
					mutation: "DELETED",
					data: post,
				},
			});
		}

		return post;
	},
	updatePost: async (parent, args, { pubsub }, info) => {
		const { id, data } = args;
		const post = await Post.findById(id);
		const originalPost = { ...post };

		if (!post) {
			throw new Error("Post not found");
		}

		if (typeof data.title === "string") {
			post.title = data.title;
		}

		if (typeof data.body === "string") {
			post.body = data.body;
		}

		if (typeof data.published === "boolean") {
			post.published = data.published;

			await post.save();

			if (originalPost.published && !post.published) {
				pubsub.publish("post", {
					post: {
						mutation: "DELETED",
						data: originalPost,
					},
				});
			} else if (!originalPost.published && post.published) {
				pubsub.publish("post", {
					post: {
						mutation: "CREATED",
						data: post,
					},
				});
			}
		} else if (post.published) {
			pubsub.publish("post", {
				post: {
					mutation: "UPDATED",
					data: post,
				},
			});
		}

		return post;
	},
	createComment:async(parent, args, { pubsub }, info)=>{

        const userExists = await User.find({ _id: args.data.author });

		if (userExists.length === 0) {
			throw new Error("User not found");
        }
		const post = await Post.find({ _id: args.data.post });

		if (post.length === 0) {
			throw new Error("Post not found");
		}
		// const userExists = db.users.some((user) => user.id === args.data.author);
		// const postExists = db.posts.some(
		// 	(post) => post.id === args.data.post && post.published
		// );

		// if (!userExists || !postExists) {
		// 	throw new Error("Unable to find user and post");
		// }

		const comment = new Comment({
			...args.data,
		});

        // db.comments.push(comment);
        
        await comment.save()
		pubsub.publish(`comment ${args.data.post}`, {
			comment: {
				mutation: "CREATED",
				data: comment,
			},
		});

		return comment;
	},
	deleteComment:async(parent, args, { pubsub }, info)=>{
        const comment = await Comment.findById(args.id)

        if(!comment){
            throw new Error('Not found')
        }
		// const commentIndex = db.comments.findIndex(
		// 	(comment) => comment.id === args.id
		// );

		// if (commentIndex === -1) {
		// 	throw new Error("Comment not found");
		// }

		await comment.remove()
		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "DELETED",
				data: comment,
			},
		});

		return comment;
	},
	updateComment:async(parent, args, { db, pubsub }, info)=>{
        const { id, data } = args;
        const comment = await Comment.findById(id)
		// const comment = db.comments.find((comment) => comment.id === id);

		if (!comment) {
			throw new Error("Comment not found");
		}

		if (typeof data.text === "string") {
			comment.text = data.text;
        }
        await comment.save()

		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "UPDATED",
				data: comment,
			},
		});

		return comment;
	},
};

export { Mutation as default };
