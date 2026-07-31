
export type  Status = "Want to Read" | "Reading" |  "Completed";


export interface UserTypes {
    name : string;
    email : string;
    password : string;
    avatar : "openBook" | "readingLamp" | "owl" | "bookMark";
}

export interface BookTypes{
    _id: string;
    title : string;
    author : string;
    tags : string[];
    status : Status;
    coverUrl? : string;
    userId : string;
    createdAt : Date;
    updatedAt : Date;
}


export interface publicUser{
    userId:string,
    name:string;
    email:string;
    avatar?: "openBook" | "readingLamp" | "owl" | "bookMark";
}