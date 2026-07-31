import {NextRequest, NextResponse} from "next/server";
import Book from "@/lib/models/Book";
import dbConnect from "@/lib/db";
import {fetchCoverUrl} from "@/lib/coverLookUp";
import {BookTypes} from "@/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
        const body = await req.json();
        const resolvedParams = await params;
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const existingBook = await Book.findOne({ _id: resolvedParams.id, userId: userId });
        if (!existingBook) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }
        const updateFields: Partial<{title:string; author:string; tags:string[]; status:string; coverUrl:string}> = {};
        if (body.title !== undefined) updateFields.title = body.title;
        if (body.author !== undefined) updateFields.author = body.author;
        if (body.tags !== undefined) updateFields.tags = body.tags;
        if (body.status !== undefined) updateFields.status = body.status;
        const titleChanged = body.title !== undefined && body.title !== existingBook.title;
        const authorChanged = body.author !== undefined && body.author !== existingBook.author;

        if (titleChanged || authorChanged) {
            const newTitle = body.title ?? existingBook.title;
            const newAuthor = body.author ?? existingBook.author;
            const coverUrl = await fetchCoverUrl(newTitle, newAuthor);
            if (coverUrl !== null) {
                updateFields.coverUrl = coverUrl;
            }
        }
        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: "No fields provided to update" }, { status: 400 });
        }
        await dbConnect();
        const book = await Book.findOneAndUpdate({ _id: resolvedParams.id, userId: userId }, updateFields, { new: true , runValidators: true, context: "query" });
        if(!book) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Book updated successfully", book }, { status: 200 });
    }catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const resolvedParams = await params;
        await dbConnect();
        const book = await Book.findOneAndDelete({ _id: resolvedParams.id, userId: userId });
        if(!book) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 });
    }catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}