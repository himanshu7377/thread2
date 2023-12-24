import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const Page= async ({params}:{params:{id?:string}})=>{

    console.log('Params:', params); // Add this line
    if (!params.id) {
        throw new Error('Invalid thread ID');
    }

    const user= await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding')
    // console.log(userInfo)

    const thread= await fetchThreadById(params.id)
    return (
        <section className="relative">
            <div>

            <ThreadCard 
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.comments}
                
                />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserID={JSON.stringify( userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {thread.children.map((ChildItem :any)=>(
                    <ThreadCard 
                    key={ChildItem._id}
                    id={ChildItem._id}
                    currentUserId={ChildItem?.id || ""}
                    parentId={ChildItem.parentId}
                    content={ChildItem.text}
                    author={ChildItem.author}
                    community={ChildItem.community}
                    createdAt={ChildItem.createdAt}
                    comments={ChildItem.comments}
                    isComment
                    />
                ))}
            </div>

        </section>
    )
}

export default Page;