const express=require('express')
const router=express.Router()
const upload=require('../Middleware/upload.middleware')
const { createApartment, getAllApartments, updateApartment, deleteApartment, getFilteredApartments } = require('../Controller/Apartment.Controller')
const { authMiddleware } = require('../Middleware/authMiddleware')
router.post('/createapartment',upload.array("images",10),authMiddleware,createApartment)
router.get('/getallapartments',authMiddleware,getAllApartments)
router.get('/getfilteredapartments',authMiddleware,getFilteredApartments)
router.put('/updateapartment/:apartmentId',upload.array("images",10),authMiddleware,updateApartment)
router.delete('/deleteapartment/:apartmentId',authMiddleware,deleteApartment)


module.exports=router