import { Avatar, Button, Dropdown, Navbar } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSearch ,faSun} from "@fortawesome/free-solid-svg-icons";
import { TextInput } from 'flowbite-react';
import {AiOutlineSearch} from 'react-icons/ai'
import { useLocation } from "react-router-dom";
import {  useDispatch, useSelector } from "react-redux";
import {signoutSuccess} from '../redux/user/userSlice';
import { toggleTheme } from "../redux/theme/themeSlice";
import { useState  , useEffect} from "react";

export default function Header() {
  

  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const {theme}=useSelector(state=>state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm,setSearchTerm]=useState('');
  //  console.log(searchTerm);
  useEffect(()=>{
       const urlParams = new URLSearchParams(location.search);
       const searchTermFromUrl =urlParams.get('searchTerm'); 
       if(searchTermFromUrl){
        setSearchTerm(searchTermFromUrl); 
       }
  },[location.search]);

   const dispatch=useDispatch();

  const handleSignOut=async()=>{
     try{
       const res = await fetch('/api/user/signout',{
        method:'POST'
       }) ;
       const data = await res.json();
       if(!res.ok){
        console.log(data.message);
       }else{
        dispatch(signoutSuccess());
       }

     }catch(err){
      console.log(err.message);
     }
  }

  const handleSubmit=(e)=>{
   e.preventDefault();
   const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',searchTerm);
     const searchQuery = urlParams.toString();
     navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar className="border-b-2">
     <Link to='/' className="self-center whitespace-nowrap text-md sm:text-2xl font-semibold dark:text-white">
         <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">{`Technos`}</span>
     </Link>
     <form onSubmit={handleSubmit}>
        <TextInput name="search" className="hidden md:inline" type="text" placeholder="search..." rightIcon={AiOutlineSearch}
        onChange={(e)=>setSearchTerm(e.target.value)}
        />
     </form>
        <Button className="w-12 h-10 md:hidden " color="gray" pill>
          <FontAwesomeIcon icon={faSearch} />
        </Button>
        <div className="flex justify-between gap-4 md:order-2 ">
           <Button className="w-13 h-10 hidden sm:inline" color="gray" pill onClick={()=>dispatch(toggleTheme())} >
            <FontAwesomeIcon className="mr-2 text-sm" icon={ theme==='light'? faMoon:faSun} />{theme==='light'?'Dark':'Light'}
            </Button>

            {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut} >Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}

              <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
              <Navbar.Link active={path==='/'} as={'div'} >
                   <Link to='/'>
                    Home
                   </Link>
              </Navbar.Link>
              <Navbar.Link active={path==='/about'} as={'div'}>
                   <Link to='/about'>
                    About
                   </Link>
              </Navbar.Link>
              {/* <Navbar.Link active={path==='/projects'} as={'div'}>
                   <Link to='/projects'>
                    Projects
                   </Link>
              </Navbar.Link> */}
              <Button className=" w-32 h-10  m-auto mt-4 sm:hidden " color="gray" pill onClick={()=>dispatch(toggleTheme())} >
            <FontAwesomeIcon className=" mr-2" icon={ theme==='light'? faMoon:faSun} />{theme==='light'?'Dark':'Light'}
            </Button>
            </Navbar.Collapse>

    </Navbar>

  )
}