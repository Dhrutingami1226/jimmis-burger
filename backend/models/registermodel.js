import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({

  userId: {
    type: Number,
    unique: true
  },

  name:{
    type:String,
    required:true,
      match: [/^[a-zA-Z0-9]+$/, ]
  },

  email: {
    type:String,
    required:true,
    unique:true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"] 
  },
  password: {
    type: String,
    required:true,
    isLength:{
        options:{min:6},
        errorMessage:"Password must be atleast of 6 characters"
    }
  }, 
  resetCode:{type:String, default:""},
  resetCodeExpire:Date
},
{timestamps:true}
);

export default mongoose.model("User", registerSchema)



