const express=require('express')
const { registerUser, loginUser, userDetail, updateUser, deleteUser, getAllUser } = require('../Controller/User.Controller')
const {authMiddleware,authorizeRoles} = require('../Middleware/authMiddleware')
const router=express.Router()
const validateUserRole = (req, res, next) => {
    const allowedRoles = ['user', 'realtor'];
    if (!req.body.role) {
      req.body.role = 'user'; // default role
    }
    if (!allowedRoles.includes(req.body.role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }
    next();
  };
router.post('/register',validateUserRole,registerUser)
router.post('/login',loginUser)
router.get('/getuser/:userId',authMiddleware,userDetail)
router.put('/updateuser/:userId',authMiddleware,updateUser)
router.delete('/deleteuser/:userId',authMiddleware,deleteUser)
router.get('/getalluser',authMiddleware,getAllUser)
module.exports=router