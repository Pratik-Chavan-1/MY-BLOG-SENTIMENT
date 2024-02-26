import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Modal, ModalHeader, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { updateFailure,updateSuccess,updateStart } from "../redux/user/userSlice";
import { deleteUserFailure,deleteUserStart,deleteUserSuccess } from "../redux/user/userSlice";
import {Link} from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { signoutSuccess } from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser ,loading,error } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadProgess, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData,setFormData]=useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const[showModal,setShowModal]=useState(false);


  // console.log(imageFileUrl,imageFileUploadProgess,imageFileUploadError);

  const filePickerRef = useRef();
  const dispatch = useDispatch();
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapchat) => {
        const progress =
          (snapchat.bytesTransferred / snapchat.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not uplaod image !  file should be less than 2MB"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData,profilePicture:downloadURL});
          setImageFileUploading(false);
        });
      }
    );
  };

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

  const handleChange=(e)=>{
      setFormData({...formData,[e.target.id]:e.target.value});
  }
  // console.log(formData);
  const handleFormSubmit=async(e)=>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        setImageFileUploadError(null);
        if(Object.keys(formData).length === 0 ){
          dispatch(updateFailure('Nothing to update'));
          return ;
        }
        if(imageFileUploading){
          setUpdateUserError('Please wait for image to upload');
        }
        try{
          dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
              method:'PUT',
              headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify(formData)
            });
              const data = await res.json();
            if(!res.ok){
              dispatch(updateFailure(data.message));
              setUpdateUserError(data.message);
            }else{
              dispatch(updateSuccess(data));
              setUpdateUserSuccess('Profile updated successfully');
            }
        
        }catch(err){
          dispatch(updateFailure('Not able to update'));
          setUpdateUserError(err.message);
        }
  
  }

  const handleDeleteUser=async()=>{
    setShowModal(false);
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      }); 
      const data = await res.json();
      if(!res.ok){
         dispatch(deleteUserFailure(data.message));
      }else{
         dispatch(deleteUserSuccess(data));
      }
    }catch(err){
       dispatch(deleteUserFailure(err.message));
    }

  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-3xl  font-semibold my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <input
          type="file"
          accpet="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden mb-6 ">
          {imageFileUploadProgess && (
            <CircularProgressbar
              value={imageFileUploadProgess || 0}
              text={`${imageFileUploadProgess}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgess / 100})`,
                },
              }}
            />
          )}
          <img
            className={`rounded-full object-cover  border-8 border-[lightgray] ${
              imageFileUploadProgess &&
              imageFileUploadProgess < 100 &&
              "opacity-30"
            }`}
            style={{ width: "100%", height: "100%" }}
            src={imageFileUrl || currentUser.profilePicture}
            alt="profile Img"
            onClick={() => {
              filePickerRef.current.click();
            }}
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder={currentUser.username}
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder={currentUser.email}
          defaultValue={currentUser.email}
          onChange={handleChange} 
        />
        <TextInput type="text" id="password" placeholder={"*******"} 
        onChange={handleChange} 
        />

        <Button type="submit" outline disabled={imageFileUploading || loading }>
          {loading ? 'Loading...':'Update'}
        </Button>
        {currentUser.isAdmin && (
        <Link to='/create-post'>
         <Button 
           gradientDuoTone={'purpleToBlue'}
           className="w-full"
           type="button"
         > 
         Create Post     
         </Button>
        </Link>
        )}
      </form>
      {updateUserSuccess && (
        <Alert color='success' className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className="mt-5">
          {error}
        </Alert>
      )}
 <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md' >
        <ModalHeader>
        </ModalHeader>
        <Modal.Body>
        <div className="text-center">
      <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-400 mb-4 mx-auto" />
      <h3 className="mb-5 whitespace-pre-wrap  text-lg text-gray-500 dark:text-gray-400">Are you sure ? You want to delete the account ?
          This action is irreversible.</h3>
    <div className="flex flex-row justify-center gap-4">
      <Button color="failure"  onClick={handleDeleteUser} >Yes I'm sure</Button>
      <Button color="gray" onClick={()=>{setShowModal(false)}}>No , cancel</Button>
    </div>
   
        </div>
        </Modal.Body>
     </Modal>

      <div className="flex flex-row justify-between p-3  text-red-500 ">
        <span onClick={()=>{setShowModal(true)}} className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer" onClick={handleSignOut}>Sign out</span>
      
      </div>

    </div>
  );
}
