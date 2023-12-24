
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"

import {redirect} from 'next/navigation'
import Searchbar from "@/components/shared/Searchbar";
import { fetchCommunities } from "@/lib/actions/community.action";
import CommunityCard from "@/components/cards/CommunityCard";


async function Page() {

    const user=await currentUser();

   if(!user) return null

    const userInfo= await fetchUser(user.id);

    // console.log(userInfo ,'userinfo  not there')
    

    if(!userInfo?.onboarded) redirect ('/onboarding')
    const result = await fetchCommunities({
        
        searchString:"",
        pageNumber:1,
        pageSize:25,
        sortBy:"asc"
      
      
      
      })

  return (
    <>
    <h1 className='head-text'>Communities</h1>

    <div className='mt-5'>
        <Searchbar routeType='communities' />
      </div>
    <section className="mt-9 flex flex-wrap gap-4"> 
       
              {
                result.communities.length === 0 ? (
                  <p className="no-result">No Communities</p>
                ):(
                  <>
                  {
                    result.communities.map((community)=>(
                      <CommunityCard 
                        key={community.id}
                        id={community.id}
                        name={community.name}
                        username={community.username}
                        imgUrl={community.image}
                        bio={community.bio}
                        members={community.members}
                        
                        />
                    ))
                  }
                  </>
                )
              }
       
    </section>
    </>
  )
}

export default Page
