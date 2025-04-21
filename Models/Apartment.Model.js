const mongoose=require('mongoose')
const apartmentSchema = new mongoose.Schema(
  {
    pictures:[String],
    description: {
      type: String,
      required: true,
    },
    areaSize: {
      type: Number, 
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    pricePerMonth: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Apartment = mongoose.model('Apartment', apartmentSchema);
module.exports=Apartment
