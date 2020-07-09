import { User } from "./models/User";

export const resolvers = {
	Query: {
		hello: () => "hi",
		users: () => User.find(),
	},
	Mutation: {
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

			if (!user) {
				throw new Error("User Doesnt Exist");
			}

			await user.remove();

			return user;
		},
	},
};
