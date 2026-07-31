import {NextRequest, NextResponse} from "next/server";
import Book from "@/lib/models/Book";
import dbConnect from "@/lib/db";
import {BookTypes} from "@/types";

export async function GET(req: NextRequest) {
    try{
        await dbConnect();
        const userId = req.headers.get("x-user-id");
        const books:BookTypes[] = await Book.find({ userId: userId }).sort({ createdAt: -1 });
        return NextResponse.json(books, { status: 200 });
    }catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

async function fetchCoverUrl(title: string, author: string): Promise<string | null> {
    try {
        const query = new URLSearchParams({ title, author, limit: "1" });
        const res = await fetch(`https://openlibrary.org/search.json?${query}`);
        const data = await res.json();
        const coverId = data.docs?.[0]?.cover_i;
        return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try{
        const {title,author,tags,status}  = await req.json();
        if(!title || !author || !tags || !status) {
            return NextResponse.json({ message: "Title, author, tags and status are required" }, { status: 400 });
        }
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const coverUrl = await fetchCoverUrl(title, author);
        await dbConnect();
        const newBook = new Book({ title, author, tags, status , userId, coverUrl });
        await newBook.save();
        return NextResponse.json({ message: "Book created successfully", book: newBook }, { status: 201 });
    }catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}