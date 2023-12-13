"use server"

import { promises } from "dns";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { string } from "zod";

interface params{
    userId:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string,
}

export async function updateUser(

    {
        userId,
    username,
    name,
    bio,
    image,
    path,
    }: params

) : Promise<void>{
    connectToDB()

    try{
        await User.findOneAndUpdate(
            {id:userId},
            {
                username:username.toLowerCase(),
                name,
                bio,
                image,
                onboarded:true,
            },
            {   upsert:true }
        );

        if(path === '/profile/edit'){
            revalidatePath(path)
        }
    }
    catch(error: any){
        throw new Error (`failed to Create/update user: ${error.message}`)
    }
}


export async function fetchUser(userId:string) {
    try{
        connectToDB()
        return await User
        .findOne({id:userId})
        // .populate({
        //     path:'communities',
        //     model:Community
        // })
    }catch(error:any){
        throw new Error (`failed to fetch user : ${error.message}`)
    }
}