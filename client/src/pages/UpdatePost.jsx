import React, { useEffect, useState } from 'react'
import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage';
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';



export default function UpdatePost() {


    const [formData, setFormData] = useState({});
  const [file,setFile]=useState(null);
  const [publishError,setPublishError]=useState(null) ;
  const [imageUploadProgress,setImageUploadProgress]=useState(null);
const [imageUploadError,setImageUploadError]=useState(null);

const {postId}=useParams();
const {currentUser}=useSelector(state=>state.user);
   
const navigate = useNavigate();


useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);
   
   
  const handleUploadImage=async(e)=>{
     
     try{
      if(!file){
     setImageUploadError('Select an image');
        return ;
      }
   setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-'+file.name ;
      const storageRef= ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);

      uploadTask.on('state_changed',(snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) *100 ;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error)=>{
         setImageUploadProgress(null);
         setImageUploadError('Image upload Failed Size should not be greater than 2MB');
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setFormData({...formData,image:downloadURL});
          setImageUploadError(null);
          setImageUploadProgress(null);
        })
      }
      );
     }catch(err){
      setImageUploadError(null);
      setImageUploadProgress(null);
      console.log(err);
     }

     
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
     try{
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}` ,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      }); 
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.message);
          return ;
      }
      if(res.ok){
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }

     }catch(err){
        setPublishError('Something went wrong');
     }
  }
  
  return (
    <div className=' min-h-screen mx-auto max-w-3xl p-3'>
       <h1 className='text-center font-semibold my-8 text-3xl'>Update Post !!!</h1>
     <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between' >
         <TextInput 
          type='text'
          placeholder='Enter title '
          required
          id='title'
          className='flex-1'
          value={formData.title}
          onChange={(e)=>setFormData({...formData , title:e.target.value})}
         />     
         <Select
          onChange={(e)=>setFormData({...formData,category:e.target.value})}
         value={formData.category}
        >
           <option value='uncategorized'>Select a category</option>
           <option value='javascript'>JavaScript</option>
           <option value='java'>Java</option>
           <option value='reactjs'>ReactJs</option>
          </Select>      
        </div>
        <div className='flex gap-4 items-center justify-between border-spacing-4 border-teal-500 border-dotted p-3'>
        <FileInput 
         type='file'
         accept='image/*'
         onChange={(e)=>{setFile(e.target.files[0])}}
        />
        <Button type='button' size={'sm'} outline onClick={handleUploadImage}  disabled={imageUploadProgress} >
       {imageUploadProgress ? (
         <div className='w-16 h-16'>
         <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%` }/>
         </div>
 ):(
        'Upload Image'
       )
 }
        </Button>
        </div>
        {imageUploadError && (
          <Alert color={'failure'}>{imageUploadError}</Alert>
        )}
        {formData.image && (
            <img src={formData.image} className='w-full h-72 object-contain' />
        )}
         {/* <img src={formData.image} alt='...loading' className='w-full h-72 object-contain' /> */}

        <ReactQuill theme='snow' value={formData.content} placeholder='write something...' className='h-72 mb-12 text-gray-800 dark:text-white' required onChange={(e)=>{
          setFormData({...formData,content:e})
        }} />  


        <Button disabled={imageUploadProgress} type='submit' gradientDuoTone={'purpleToBlue'}>
           Update Post
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure' >
           {publishError}
          </Alert>
        )}
     </form>
    </div>
  )
}
