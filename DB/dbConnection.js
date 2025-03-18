const mongoose=require('mongoose')

const dbConnection=async()=>{
try {
    const connect=await mongoose.connect(process.env.MONGO_URI)
    console.log('MONGODB Connected',connect.connection.name,connect.connection.host)
} catch (error) {
    console.log("MONGODB not Connected",error)
    process.exit(1)
}
}

module.exports=dbConnection