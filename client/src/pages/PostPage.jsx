import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
    const {postSlug}=useParams();
    const[error,setError]=useState(false);
    const[loading,setLoading]=useState(true);
    const[post,setPost]=useState(null);
    const[recentPost,setRecentPost]=useState(null);
    // console.log(postSlug);
    // console.log(post);
useEffect(()=>{
    const fetchPost=async()=>{
        try{
            const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
             
            const data = await res.json();

             if(res.ok){
                 setError(null);
                 setLoading(false);
                 setPost(data.posts[0]);
                }else{
                    setError(true);
                    setLoading(false);
                    return ;
                }
                setLoading(false);
        }catch(err){
             setError(true);
             setLoading(false);
        }
    }
    fetchPost();
},[postSlug]);

 useEffect(()=>{
     const fetchRecentPost = async()=>{
          try{
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if(res.ok){
            setRecentPost(data.posts); 
        }
    }
    catch(err){
        console.log(err.message);
    }
    }
    fetchRecentPost();
 },[]);

if(loading){
   return  <div className='flex justify-center items-center min-h-screen' >
        <Spinner size='xl' />
    </div>
}
  return (
   
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1
        className=' text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'
        >{post && post.title}</h1>
        <Link className='mt-5 self-center' to={`/search`} >
         <Button color='gray' pill size='xs' >
            {post && post.category}
         </Button>
         </Link>
         <img src={post && post.image} alt={post && post.title} 
          className='mt-8 p-3 max-h-[500px]  object-cover max-w-1/2 mx-auto rounded-3xl shadow-md'
         />
         <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm'>
          <span>
    {post && new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span  className='italic' >
            {post && (post.content.length/500).toFixed(0)} mins read
          </span>
         </div>
         <div
          className='p-3 max-w-2xl mx-auto w-full post-content'
          dangerouslySetInnerHTML={{__html: post && post.content}}
         >
         </div>

            <CommentSection postId={post._id} />

            <div className='flex flex-col justify-center items-center mb-5'>
                <h1 className=' text-xl mt-5'>
                    Recent Articles
                </h1>
                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                     {recentPost && recentPost.map((post)=>(
                        <PostCard key={post._id} post={post} />
                     ))}
                </div>
            </div>
            
    </main>
  )
}
