import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
const bcrypt = require("bcrypt");

import getUserId from "../utils/getUserId";

const Mutation = {
	createUser: async (_, { data }) => {
		const emailTaken = await User.find({ email: data.email });
		if (emailTaken.length >= 1) {
			throw new Error("Email already taken");
		}
		const { name, email, age, password } = data;
		const hash = await bcrypt.hash(password, 12);
		console.log(hash);
		var user = new User({ name, email, age, password: hash });

		const person = await user.save();
		return person;
	},
	updateUser: async (_, { data }, { request }, info) => {
		const userId = getUserId(request);
		const user = await User.findById(userId);

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
	deleteUser: async (_, {}, { request }) => {
		const userId = getUserId(request);
		const user = await User.findById(userId);

		await Post.deleteMany({ author: userId });
		await Comment.deleteMany({ author: userId });
		if (!user) {
			throw new Error("User Doesnt Exist");
		}

		await user.remove();

		return user;
	},
	createPost: async (parent, args, { pubsub, request }, info) => {
		const userId = getUserId(request);

		const userExists = await User.find({ _id: userId });

		if (userExists.length === 0) {
			throw new Error("User not found");
		}

		const post = await new Post({
			...args.data,
			author: userId,
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
	deletePost: async (parent, args, { pubsub, request }, info) => {
		const userId = getUserId(request);
		const post = await Post.findById(args.id);
		if (!post) {
			throw new Error("Post does not exist");
		}

		if (post.author != userId) {
			throw new Error("This is not your post");
		}

		await post.remove();
		await Comment.deleteMany({ post: args.id });

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
	updatePost: async (parent, args, { pubsub, request }, info) => {
		const { id, data } = args;
		const post = await Post.findById(id);
		const userId = getUserId(request);
		if (!post) {
			throw new Error("Post does not exist");
		}
		if (post.author != userId) {
			throw new Error("This is not your post");
		}
		const originalPost = { ...post };

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
	createComment: async (parent, args, { pubsub, request }, info) => {
		const userId = getUserId(request);
		const userExists = await User.find({ _id: userId });

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
			author: userId,
		});

		// db.comments.push(comment);

		await comment.save();
		pubsub.publish(`comment ${args.data.post}`, {
			comment: {
				mutation: "CREATED",
				data: comment,
			},
		});

		return comment;
	},
	deleteComment: async (parent, args, { pubsub, request }, info) => {
		const userId = getUserId(request);
		const comment = await Comment.findById(args.id);

		if (!comment) {
			throw new Error("Not found");
		}
		if (comment.author != userId) {
			throw new Error("This is not your comment");
		}

		await comment.remove();
		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "DELETED",
				data: comment,
			},
		});

		return comment;
	},
	updateComment: async (parent, args, { request, pubsub }, info) => {
		const userId = getUserId(request);
		const comment = await Comment.findById(args.id);

		if (!comment) {
			throw new Error("Not found");
		}
		if (comment.author != userId) {
			throw new Error("This is not your comment");
		}

		if (typeof data.text === "string") {
			comment.text = data.text;
		}
		await comment.save();

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
