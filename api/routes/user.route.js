import express from 'express'
import { deleteUser, getUser, getUsers, test } from '../controllers/user.controller.js';
import { signout } from '../controllers/user.controller.js';
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

// router.get('/',(req,res)=>{
//     res.send('user route');
// })

// router.get('/test',test);
router.get('/getusers',verifyToken,getUsers);
router.put('/update/:userId',verifyToken, updateUser);
router.post('/signout', signout);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.get('/:userId',getUser);


export default router;