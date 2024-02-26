import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {HiUser,HiArrowSmRight, HiChartBar, HiDocumentText, HiOutlineUserGroup} from 'react-icons/hi'
import { signoutSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


export default function DashSidebar() {

    const dispatch=useDispatch();
    const location= useLocation();
    const {currentUser}=useSelector(state=>state.user);
    const [tab,setTab]=useState('');
    useEffect(()=>{
         const url=new URLSearchParams(location.search);
         const tabFromUrl = url.get('tab');
         if(tabFromUrl){
            setTab(tabFromUrl);
         }
    },[location.search]);

    const handleSignOut=async()=>
    {
        try{
            const res = await fetch('/api/user/signout',{
                method:'POST'
            });
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }else{
                dispatch(signoutSuccess());
            }
        }
       catch(err){
            console.log(err.message);
       }
    }

  return (
    <Sidebar className='w-full md:w-56'>
    <Sidebar.Items>

    <Sidebar.ItemGroup className='flex flex-col gap-1'>

  { currentUser && currentUser.isAdmin && (
    <Link to='/dashboard?tab=dash'>
        <Sidebar.Item 
        active={tab==='dash' || !tab}
            icon={HiChartBar}
            as='div'
            >
                Dashboard
        </Sidebar.Item>
    
    </Link>
  ) }

       <Link to='/dashboard?tab=profile'>
        <Sidebar.Item
         active={tab==='profile'}
         icon={HiUser}
         label={currentUser.isAdmin?'Admin':'User'}
         labelColor='dark'
         as='div'
        >
              Profile
        </Sidebar.Item>
       
       </Link>
       { currentUser && currentUser.isAdmin && (
       <Link to='/dashboard?tab=posts'>
        <Sidebar.Item active={tab==='posts'}
         icon={HiDocumentText}
         as='div'
        >
              {'Posts'}
        </Sidebar.Item>
       </Link>
       )}
         { currentUser && currentUser.isAdmin && (
       <Link to='/dashboard?tab=users'>
        <Sidebar.Item active={tab==='users'}
         icon={HiOutlineUserGroup}
         as='div'
        >
              {'Users'}
        </Sidebar.Item>
       </Link>
       )}
        { currentUser && currentUser.isAdmin && (
       <Link to='/dashboard?tab=comments'>
        <Sidebar.Item active={tab==='comments'}
         icon={HiDocumentText}
         as='div'
        >
              {'Comments'}
        </Sidebar.Item>
       </Link>
       )}
        <Sidebar.Item 
           icon={HiArrowSmRight}
           className='cursor-pointer'
           onClick={handleSignOut} 
        >
            Sign Out
        </Sidebar.Item>


    </Sidebar.ItemGroup>
    </Sidebar.Items>
    </Sidebar>
  )
}
