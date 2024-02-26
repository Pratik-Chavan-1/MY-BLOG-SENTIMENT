import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
export default function CommentSection({postId}) {
 
    const {currentUser}=useSelector(state=>state.user);
    const[comment,setComment]=useState('');
    const[commentError,setCommentError]=useState(null);
    const[loading,setLoading]=useState(false);
    const[comments,setComments]=useState([]);
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setCommentError(null);
        setLoading(true);
        if(comment.length>200){
          setLoading(true);
          return ;
        }
        if(comment.trim()===''){
          setCommentError('It can not be emplty');
          setLoading(true);
          return ;
        }
        try{
const res= await fetch('/api/comment/create',{
   method:'POST',
   headers:{
    'Content-Type':'application/json',
   },
   body:JSON.stringify({
    content:comment,
    postId,
    userId:currentUser._id
   })
})
     const data = await res.json();
     if(res.ok){
      setComment('');
      setLoading(false);
     setCommentError(null);
     setComments([data,...comments]);
     }    

        }catch(err){
          setLoading(true);
          setCommentError(err.message);
        } 
    }

    useEffect(()=>{
        const getComments = async()=>{
          try{
              const res = await fetch(`/api/comment/getpostcomments/${postId}`);
              if(res.ok){
                const data = await res.json();
                setComments(data);
              }
          }catch(err){
            console.log(err.message);
          }

        }
        getComments();
    },[postId]);

    //  console.log(comments);

    const handleLike=async(commentId)=>{
       try{
          if(!currentUser){
            navigate('/signin');
            return ;
          }
          const res = await fetch(`/api/comment/likecomment/${commentId}`,{
            method:'PUT',
          });
          if(res.ok){
            const data = await res.json();
            setComments(comments.map((comment)=>comment._id===commentId ? {
              ...comment,likes:data.likes,
              numberOfLikes:data.likes.length
            }:comment ));
          }
       }catch(err){
        console.log(err.message);
       }
    }

    return (
    <div className=' max-w-2xl mx-auto w-full p-3'>
        {currentUser ? (
            <div className='flex items-center gap-1 my-5 to-gray-500 text-sm'>
          <p>Signed in as</p>
          <img src={currentUser.profilePicture} alt={currentUser.email}
           className='w-5 h-5 rounded-full object-cover'
          />
           <Link className='text-xs text-cyan-600 hover:underline' to={'/dashboard?tab=profile'}>
           @{currentUser.username}
           </Link>
            </div>
        ):(
           <div className='text-sm text-teal-500 my-5 flex gap-2'>
            You must login in to comment
            <Link className='text-blue-500 hover:underline' to='/signin'>
               Sign In 
            </Link>
             </div>

        )}
        {currentUser && (
          <form
           onSubmit={handleSubmit}
          className='border border-teal-500 p-3 rounded-md'>
             <Textarea  
              placeholder='Add a comment...'
              rows='3'
              maxLength='200'
              value={comment}
              onChange={(e)=>
                {setComment(e.target.value) 
                setCommentError(null) 
               setLoading(false);
              }}
             />
             <div className='flex justify-between mt-5 items-center'>
              <p className='text-gray-500 text-xs'>
                 {200-comment.length} characters remaining
              </p>
              <Button type='submit' outline 
              disabled={loading}
              >
                Submit
              </Button>
             </div>
             {commentError && (
              <Alert color={'failure'} className='mt-5'>
                {commentError}
              </Alert>
             )

             }
          </form>
        )}
        {!comments ? (
         <p className='text-sm my-5' >No comments yet! </p>
        ):( <>
            <div className='flex items-center gap-2 my-5 text-sm'>
              <p>Comments</p>
              <div className='border border-gray-500 py-1 px-2 rounded-full'>
                <p>{comments.length}</p>
              </div>
            </div>
            {
                comments.map((comment)=>(
                 <Comment 
                  key={comment._id}
                  comment={comment}
                  onLike={handleLike}
                 />
                ))
            }
         </>
        )}
     
    </div>
  )
}
