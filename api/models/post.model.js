import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true ,
        unique:true
    },
    image:{
        type:String,
        default:'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9zdHxlbnwwfHwwfHx8MA%3D%3D'
    },
    category:{
        type:String,
        default:'uncategorized'
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
} ,
{
    timestamps:true
} 
);

const  Post = mongoose.model('Post',postSchema);
export default Post;