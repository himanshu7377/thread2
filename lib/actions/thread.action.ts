"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
         connectToDB();


         const CreatedThread=await Thread.create({
            text,
            author,
            community:null,

         })


        //  update user modal

        await User.findByIdAndUpdate(author,{
            $push:{threads:createThread._id}
        })

        revalidatePath(path)
}