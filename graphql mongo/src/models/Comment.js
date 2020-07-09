import mongoose from "mongoose";

export const Comment = mongoose.model("Comment", 
{ 
    text: String ,
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    post:{type:mongoose.Schema.Types.ObjectId,ref:"Post"},
});
