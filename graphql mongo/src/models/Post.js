import mongoose from "mongoose";

export const Post = mongoose.model("Post", 
{ 
    title: String ,
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    body:String,
    published:Boolean
});
