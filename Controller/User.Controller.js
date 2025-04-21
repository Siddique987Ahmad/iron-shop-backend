const User=require('../Models/User.Model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const generateToken=(user)=>{
    return jwt.sign({_id:user._id,role: user.role},process.env.JWT_SECRET,{expiresIn:'7d'})
}

const registerUser=async(req,res)=>{

    try {
        const {userName,email,password,role}=req.body
        const allowedRoles = ['user', 'realtor'];
    const userRole = allowedRoles.includes(role) ? role : 'user';
        const existingUser=await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message:"user already existed"})
        }
    
        const userCreate=await User.create({
            userName,
            email,
            password,
            role:userRole
        })
    if (!userCreate) {
        return res.status(401).json({message:"user not registered"})
    }
    const token=generateToken(userCreate._id)
    res.status(200).json({message:"user registered",userCreate,token})
    } catch (error) {
        res.status(500).json({message:"user not registered",error:error.message})

    }
}
const loginUser=async(req,res)=>{
   try {
     const {email,password}=req.body
     const user=await User.findOne({email})
      if (!user) {
         return res.status(400).json({message:"invalid email or password"})
      }
      const isMatch=await user.comparePassword(password)
      if (!isMatch) {
         return res.status(400).json({message:"invalid email or password"})
      }
 const token=generateToken(user)
 return res.status(200).json({
    message: "login successfully",
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
    token,
  });
      //return res.status(200).json({message:"login successfully",user,token})
 
   } catch (error) {
    return res.status(500).json({message:"login invalid",error:error.message})

   }
}
const userDetail=async(req,res)=>{
    try {
        const {userId}=req.params
        const requestingUser = await User.findById(req.user.id); // The user making the request

    // Check if the requesting user is an admin or employee
    if (requestingUser.role !== 'admin' && requestingUser.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. Only admins and employees can access this route.' });
    }
    const user=await User.findById(userId).select('-password')
        if (!user) {
            return res.status(400).json({message:"user not found"})
         }
        res.status(200).json({message:"here is user",user})
    } catch (error) {
        return res.status(500).json({message:"invalid",error:error.message})
    }
}
const updateUser=async(req,res)=>{
    try {
        const {userId}=req.params
        const {email,role,userName}=req.body
        const requestingUser=await User.findById(req.user.id)
        if (requestingUser.role!=='admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can update.' });
        }
        const user=await User.findByIdAndUpdate(
            userId,
            {
                email,userName,role
            },
            {
                new:true,runValidators:true
            }
        ).select('-password')
        if (!user) {
            return res.status(400).json({message:"user not update"})
         }
        res.status(200).json({message:"User updated",user})
    } catch (error) {
        return res.status(500).json({message:"invalid",error:error.message})
    }
}
const deleteUser=async(req,res)=>{
    try {
        const {userId}=req.params
        const requestingUser=await User.findById(req.user.id)
        if (requestingUser.role!=='admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can delete.' });
        }
        const user=await User.findByIdAndDelete(userId)
        if (!user) {
            return res.status(400).json({message:"user not delete"})
         }
        res.status(200).json({message:"User deleted",user})
    } catch (error) {
        return res.status(500).json({message:"invalid",error:error.message})
    }
}
const getAllUser=async(req,res)=>{
    try {
        const requestingUser=await User.findById(req.user.id)
        if (requestingUser.role!=='admin') {
            return res.status(403).json({message:"Access denied only admin see all users"})
        }
        const user=await User.find({})
        if (!user) {
            return res.status(400).json({message:"users not found"})
        }
        res.status(200).json({message:"here is all users",user})
    } catch (error) {
        return res.status(500).json({message:"invalid",error:error.message})
    }
}

module.exports={registerUser,loginUser,userDetail,updateUser,deleteUser,getAllUser}