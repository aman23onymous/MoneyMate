import mongoose from "mongoose"

const connectDB= async()=>{
     try{
          let connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
          console.log(`connection has been established  ${connectionInstance}`)
     }
     catch(error){
         console.log(`error occur during databse connection ${error}`);
         throw error;
     }
}
export default  connectDB