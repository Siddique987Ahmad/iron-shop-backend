const express=require('express')
const dotenv=require('dotenv').config()
const userRoute=require('./Routes/User.Route')
const dbConnection = require('./DB/dbConnection')

const app=express()
dbConnection()

app.use(express.json())

app.use('/api/user',userRoute)

const port=process.env.PORT || 4000
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})