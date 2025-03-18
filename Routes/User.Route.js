const express=require('express')
const { registerUser, loginUser, userDetail, updateUser, deleteUser, getAllUser } = require('../Controller/User.Controller')
const authMiddleware = require('../Middleware/authMiddleware')
const router=express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/getuser/:userId',authMiddleware,userDetail)
router.put('/updateuser/:userId',authMiddleware,updateUser)
router.delete('/deleteuser/:userId',authMiddleware,deleteUser)
router.get('/getalluser',authMiddleware,getAllUser)
module.exports=router