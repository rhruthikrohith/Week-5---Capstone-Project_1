import { Schema, model } from "mongoose";

const userschema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "first name is required"]
    },

    lastname: {
      type: String
    },

    email: {
      type: String,
      required: [true, "email required"],
      unique: true
    },

    password: {
      type: String,
      required: [true, "password required"]
    },

    profileimageurl: {
      type: String
    },

    role: {
      type: String,
      enum: ["AUTHOR", "USER", "ADMIN"],
    },

    isactive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,    
    strict: "throw",    
    versionKey: false     
  }
);

// create model
export const usermodel = model("author", userschema);
