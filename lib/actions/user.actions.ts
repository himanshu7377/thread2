"use server"


import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { string } from "zod";
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";

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
        // .populate('threads')
    }catch(error:any){
        throw new Error (`failed to fetch user : ${error.message}`)
    }
}


export async function fetchUserPosts(userId:string) {
    try {
        connectToDB()

        // find all the thread of the user by given userId

        // ToDo populate community
        const threads= await User.findOne({id:userId})
            .populate({
                path:'threads',
                model:'Thread',
                populate:{
                    path:'children',
                    model:'Thread',
                    populate:{
                        path:'author',
                        model:'User',
                        select:'name image id '
                    }
                }
            })


            return threads;
    } catch (error:any) {
        throw new Error(`failed to fetch user post :${error.message}`)
    }
} 


export async function fetchUsers({
    userId,
    searchString,
    pageNumber=1,
    pagesize=20,
    sortBy='desc'
}:{
    userId:string,
    searchString?:string,
    pageNumber?:number,
    pagesize?:number,
    sortBy?:SortOrder
}){
    try {
        connectToDB()

        const skipAmount = (pageNumber-1)* pagesize;

        const regex= new RegExp( searchString?'i':"")

        const query: FilterQuery <typeof User> ={
            id:{$ne:userId}
        }


        if(searchString?.trim() ! ==''){
            query.$or =[
                {username:{$regex:regex}},
                {name:{$regex:regex}}
            ]
        }

        const sortOptions = {createdAt:sortBy}

        const usersQuery =User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pagesize)


        const totaluserCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totaluserCount >skipAmount + users.length;

        return {users,isNext}
    } catch (error:any) {
        throw new Error (`Failed to fetch users:${error.message}`)
    }
}



export async function getActivity(userId:string){
    try {
        connectToDB()

        // find all the threads created by the user 
        const userThreads = await Thread.find({author:userId})

        // collect all the child thread ids (replies) from the children field

        const childThreads = userThreads.reduce((acc,userThreads)=>{
            return acc.concat(userThreads.children)
        },[])

        const replies = await Thread.find({
            _id:{$in:childThreads},
            author:{$ne:userId}
        }).populate({
            path:'author',
            model:'User',
            select:"name , image , _id"
        })


        return replies
    } catch (error:any) {
        throw new Error(`Failed to laod activity :${error.message}`);
        
    }
}
    
