const Event=require('../Models/Event.Model')
const mongoose = require('mongoose');
//Create Event

const createEvent=async(req,res)=>{
    try {
        const { title, information, startTime, endTime, host, city, guests, averageAge,genderRatio } = req.body;        const event=new Event()
        //const picture = req.file ? `/uploads/${req.file.filename}` : null; // Single image
        //const parsedGenderRatio = genderRatio ? JSON.parse(genderRatio) : { male: 0, female: 0 };
        // Convert data types
         // Convert data types
         const parsedStartTime = new Date(startTime);
         const parsedEndTime = new Date(endTime);
         const parsedAverageAge = Number(averageAge);
         const parsedGuests = Number(guests);

        // Validate ObjectId for host
        if (!mongoose.isValidObjectId(host)) {
            return res.status(400).json({ message: "Invalid host ID" });
        }

        const genderData = genderRatio
            ? {
                  male: parseInt(genderRatio.male) || 0,
                  female: parseInt(genderRatio.female) || 0,
              }
            : { male: 0, female: 0 };
         // Ensure files were uploaded
         if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded!" });
        }
        const pictures = req.files.map(file => `/uploads/${file.filename}`);
        const newEvent=await Event.create({
            title,
            information,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            host,
            city,
            guests: parsedGuests,
            averageAge: parsedAverageAge,
            genderRatio: genderData,
            pictures,
        })
        if (!newEvent) {
            return res.status(401).json({message:"Event not created"})
        }
        res.status(200).json({message:"Event created",newEvent})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//get all events
const getAllEvents=async(req,res)=>{
    try {
        //const allEvents=await Event.find({ startTime: { $gte: new Date() } })
         const allEvents=await Event.find();

        if (!allEvents || allEvents.length===0) {
            return res.status(401).json({message:"Events not found"})
        }
      res.status(200).json({message:"Here is all Events",allEvents})
        
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
//update event
const updateEvent=async(req,res)=>{
    try {
        const {eventId}=req.params
        const {title, information, startTime, endTime, host, city, guests, averageAge}=req.body
        const eventUpdate=await Event.findByIdAndUpdate(
            eventId,
            {
                title,
                information,
                startTime,
                endTime,
                host,
                city,
                guests,
                averageAge
            },
            {
                new:true,runValidators:true
            },
        )
        if (!eventUpdate) {
            return res.status(401).json({message:"Events not found"})
        }
        res.status(200).json({message:"Here is updated Event",eventUpdate})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//delete event
const deleteEvent=async(req,res)=>{
    try {
        const {eventId}=req.params
        const eventDelete=await Event.findByIdAndDelete(eventId)
        if (!eventDelete) {
            return res.status(401).json({message:"Event not found"})
        }
        res.status(200).json({message:"Here is deleted Event",eventDelete})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports={createEvent,getAllEvents,updateEvent,deleteEvent}