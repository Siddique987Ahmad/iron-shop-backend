const Apartment=require('../Models/Apartment.Model') 
const mongoose = require('mongoose');
//Create Apartment

const createApartment=async(req,res)=>{
    try {
        const {description,areaSize,rooms,pricePerMonth,location } = req.body;        
        const apartment=new Apartment()

        // Validate ObjectId for ListedBy
        // if (!mongoose.isValidObjectId(listedBy)) {
        //     return res.status(400).json({ message: "Invalid listed ID" });
        // }
         // Ensure files were uploaded
         if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded!" });
        }
        const pictures = req.files.map(file => `/uploads/${file.filename}`);
        const newApartment=await Apartment.create({
            description,
            areaSize,
            rooms,
            pricePerMonth,
            location,
            pictures,
            listedBy:req.user._id
        })
        if (!newApartment) {
            return res.status(401).json({message:"Apartment not created"})
        }
        res.status(200).json({message:"Apartment created",newApartment})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//get all Apartments
const getAllApartments=async(req,res)=>{
    try {
        const { role, _id } = req.user;
    
        let apartments;
    
        if (role === 'user') {
          apartments = await Apartment.find({
            listedBy: { $ne: _id }, // show others' apartments
          });
        } else if (role === 'realtor') {
          apartments = await Apartment.find({ listedBy: _id }); // show own apartments
        } else {
          apartments = await Apartment.find(); // admin or default
        }
    
        res.status(200).json(apartments);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
      }
}
const getFilteredApartments = async (req, res) => {
    try {
        const { role, _id } = req.user;
      const { minPrice, maxPrice, location, search } = req.query;
  
      let filter = {};
      if (role === 'user') {
        filter.listedBy = { $ne: _id }; // users see others' listings
      } else if (role === 'realtor') {
        filter.listedBy = _id; // realtors see their own listings
      }
  
      // Price range filter
      if (minPrice || maxPrice) {
        filter.pricePerMonth = {};
        if (minPrice) filter.pricePerMonth.$gte = parseInt(minPrice);
        if (maxPrice) filter.pricePerMonth.$lte = parseInt(maxPrice);
      }
  
      // Location search (case-insensitive partial match)
      if (location) {
        filter.location = { $regex: location, $options: 'i' };
      }
  
      // Description search (keywords)
      if (search) {
        filter.description = { $regex: search, $options: 'i' };
      }
  
      const apartments = await Apartment.find(filter).populate('listedBy', 'name email');
      res.status(200).json(apartments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching apartments' });
    }
  };

//update Apartment
const updateApartment=async(req,res)=>{
    try {
        const { apartmentId } = req.params;
        const { description, areaSize, rooms, pricePerMonth, location } = req.body;
    
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(apartmentId)) {
          return res.status(400).json({ message: 'Invalid apartment ID' });
        }
    
        // Make sure only realtors can update
        if (req.user.role !== 'realtor') {
          return res.status(403).json({ message: 'Only realtors can update apartments' });
        }
    
        // Find apartment and verify ownership
        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) {
          return res.status(404).json({ message: 'Apartment not found' });
        }
    
        if (apartment.listedBy.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'You can only update your own apartments' });
        }
     // Handle image updates
     if (req.files && req.files.length > 0) {
        const newImagePaths = req.files.map(file => `/uploads/${file.filename}`); // or use file.filename
       // console.log("Files:", req.files);
        apartment.pictures = newImagePaths; // replace old ones (or you can append)
      }
      

        // Proceed with update
        apartment.description = description;
        apartment.areaSize = areaSize;
        apartment.rooms = rooms;
        apartment.pricePerMonth = pricePerMonth;
        apartment.location = location;
    
        const updatedApartment = await apartment.save();
    
        res.status(200).json({
          message: 'Apartment updated successfully',
          apartment: updatedApartment,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}
//delete apartment
const deleteApartment=async(req,res)=>{
    try {
        const { apartmentId } = req.params;
    
        // Fetch apartment to verify ownership
        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) {
          return res.status(404).json({ message: "Apartment not found" });
        }
    
        // Check if user is a realtor and is the one who listed it
        if (req.user.role !== 'realtor' || apartment.listedBy.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Unauthorized to delete this apartment" });
        }
    
        const deletedApartment = await Apartment.findByIdAndDelete(apartmentId);
    
        res.status(200).json({
          message: "Apartment deleted successfully",
          deletedApartment,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

module.exports={createApartment,getAllApartments,updateApartment,deleteApartment,getFilteredApartments}