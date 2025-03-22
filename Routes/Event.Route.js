const express=require('express')
const { createEvent, getAllEvents, updateEvent, deleteEvent } = require('../Controller/Event.Controller')
const router=express.Router()
const upload=require('../Middleware/upload.middleware')
router.post('/createevent',upload.array("images",10),createEvent)
router.get('/getallevents',getAllEvents)
router.put('/updateevent/:eventId',updateEvent)
router.delete('/deleteevent/:eventId',deleteEvent)


module.exports=router