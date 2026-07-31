import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    tags:{
        type: [String]
    },
    status:{
        type: String,
        enum: ["Want to Read", "Reading", "Completed"],
        required: true,
    },
    coverUrl:{
        type: String,
    },
    userId:{
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
},{timestamps: true});

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default Book;