import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
export default function Dashboard() {
  
  const location= useLocation();
  const [tab,setTab]=useState('');
 
  useEffect(()=>{
    const urlFromSearch = new URLSearchParams(location.search);
    const tablFromUrl = urlFromSearch.get('tab');
    if(tablFromUrl){
      setTab(tablFromUrl);
    }
  },[location.search]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row" >
     <div className="md:w-60">
        <DashSidebar />
     </div>
     { tab==='dash' && <DashboardComp /> }
     { tab==='profile' && <DashProfile /> }
     {tab==='posts' && <DashPosts />}
     {tab==='users' && <DashUsers />}
     {tab==='comments' && <DashComments />}
    </div>
  )
}
