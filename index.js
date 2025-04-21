const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv').config()
const userRoute=require('./Routes/User.Route')
const eventRoute=require('./Routes/Event.Route')
const apartmentRoute=require('./Routes/Apartment.Route')
const dbConnection = require('./DB/dbConnection')
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const app=express()
dbConnection()

app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use(cors())
app.use('/api/user',userRoute)
app.use('/api/event',eventRoute)
app.use('/api/apartment',apartmentRoute)

const port=process.env.PORT || 4000
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})