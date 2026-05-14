import { Schema, model } from "mongoose";

// create user comment schema
const usercommentschema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "author"
  },
  comment: {
    type: String
  }
});

const articleschema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "author"
    },
    title: {
      type: String,
      required: [true, "title required"]
    },
    category: {
      type: String,
      required: [true, "category required"]
    },
    comments: [usercommentschema],
    isarticleactive: {
      type: Boolean,
      default: true
    },
    content: {
      type: String,
      required: [true, "content required"]
    }
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false
  }
);

export const articlemodel = model("article", articleschema);
