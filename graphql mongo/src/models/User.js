import mongoose from "mongoose";

export const User = mongoose.model("User", {
	name: String,
	email: String,
	age: String,
	password: String,
});
