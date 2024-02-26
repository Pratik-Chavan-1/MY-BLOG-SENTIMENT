import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import {FaThumbsUp} from 'react-icons/fa'

export default function Comment({comment,onLike}) {

// console.log(comment);
const[user,setUser]=useState({});
const {currentUser}=useSelector(state=>state.user);

   useEffect(()=>{
        const getUser = async()=>{
            try{
            const res = await fetch(`/api/user/${comment.userId}`);
            const data = await res.json();
            if(res.ok){
                    setUser(data);
            }
            }catch(err){

            }
        }
        getUser();
   },[comment]);

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img src={user.profilePicture} alt='username' 
         className='w-10 h-10 rounded-full bg-gray-300'
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
            <span className=' font-bold mr-1 test-xs truncate'>{ user ? `@${user.username}`:'anonymous user'}</span>
         <span className='text-gray- text-xs' >
            {moment(comment.createdAt).fromNow()}
         </span>
        </div>
        <p className='text-gray-500 pb-2'>{comment.content}</p>
        
        <div className='flex items-center gap-3 pt-2 text-xs'>
            <button type='button' onClick={()=>onLike(comment._id)} className={` text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500' }  `}>
            <FaThumbsUp className='text-sm' />
            </button>
            <p className='text-gray-400'>
              {comment.numberOfLikes > 0 &&  (comment.numberOfLikes+ " "+ (comment.numberOfLikes==1?'Like':'Likes'))}
            </p>
        </div>
      </div>
    </div>
  )
}
