import {  useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import  {FaCheck,FaTimes} from 'react-icons/fa'

export default function DashUsers() {

  const[users,setUsers]=useState([]);
  const [showMore,setShowMore]=useState(true);
  const {currentUser}=useSelector(state=>state.user);
  const [showModal,setShowModal]=useState(false);
  const [userIdToDelete,setShowUserIdToDelete]=useState('');
  // console.log(userPosts);

  useEffect(()=>{
           const fetchUsers = async()=>{
               try{
                 const res = await fetch(`/api/user/getusers`);
                 const data = await res.json();
                 if(res.ok){
                   setUsers(data.users);
                   if(data.users.length<9){
                     setShowMore(false);
                   }
                 }

               } catch(err){
                 console.log(err.message);

               }  
           };
           if(currentUser.isAdmin){
             fetchUsers();
           }
  },[currentUser._id]);
  const handleShowMore=async ()=>{
    const startIndex=users.length ;
      try{
        const res = await fetch(`/api/user/getposts?startIndex=${startIndex}`);
        const data = await res.json();
        if(res.ok){
          setUsers((prev)=>[...prev,...data.users]);
          if(data.users.length<9){
            setShowMore(false);
          }
        }
      }catch(err){
        console.log(err.message);
      }
  }


     const handleDeleteUser=async()=>{
       setShowModal(false);
       try{
        const res = await fetch(`/api/user/delete/${userIdToDelete}`,{method:'DELETE'});
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);
        }else{
          setUsers((prev)=>  prev.filter((user)=>user._id!==userIdToDelete)
          );
        //   setShowModal(false);
        }

       }catch(err){
         console.log(err.message);
       }
     }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
         {
          currentUser.isAdmin && users.length > 0 ? (
              <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>
                    Number
                </Table.HeadCell>
                <Table.HeadCell>
                    Date created
                </Table.HeadCell>
                <Table.HeadCell>
                    User Image
                </Table.HeadCell>
                <Table.HeadCell>
                   User Name
                </Table.HeadCell>
                <Table.HeadCell>
                   Email
                </Table.HeadCell>
                <Table.HeadCell>
                   Admin
                </Table.HeadCell>
                <Table.HeadCell>
                    Delete
                </Table.HeadCell>
              </Table.Head>
             {users.map((user,index)=> ( 
             <Table.Body className=' divide-y' key={user._id}>
                <Table.Row className='bg-white dark: border-gray-700 dark:bg-gray-800'>  
               <Table.Cell>
                <p className='w-2 m-auto'>
                {index+1}
                </p>
               </Table.Cell>
         <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
         <Table.Cell>

<img src={user.profilePicture} alt={user.username} 
className='w-10 h-10 rounded-full object-cover bg-gray-500'
/>

          </Table.Cell>
         <Table.Cell>
          {user.username}
          </Table.Cell>
         <Table.Cell>
           {user.email}
          </Table.Cell>
         <Table.Cell>
           {user.isAdmin ?( <FaCheck className='text-green-600' /> ) :(<FaTimes className='text-red-500' />)}
          </Table.Cell>
             <Table.Cell>
               <span  onClick={()=>{setShowModal(true)
               setShowUserIdToDelete(user._id)
              }} className=' font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
             </Table.Cell>
            
                </Table.Row>

               </Table.Body>

))}
            </Table>
            {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-medium py-7'
            >
              Show more
            </button>
          )}
            </>
          ) :(
            <p> {'You Have not users yet'}</p>
          )
         }
         <Modal 
         show={showModal}
         onClose={()=>setShowModal(false)}
         popup
         size='md'
         >
          <Modal.Header />
          <Modal.Body>
       <div className='text-center'>
       <HiOutlineExclamationCircle className='h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto' />
       <h3  className='mb-5 text-lg text-gray-500 dark:to-gray-400' >Are you sure want to delete this user  </h3>
       <div className='flex justify-center gap-4' >
      <Button color='failure' 
      onClick={handleDeleteUser}
      >Yes I'am sure</Button>
      <Button onClick={()=>setShowModal(false)} color='gray'> No , cancel
      </Button>
       </div>
       </div>
          </Modal.Body>
         </Modal>
         
    </div>
  )
}
