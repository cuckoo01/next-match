import React from 'react'
import { getMembers } from '../(auth)/actions/memberActions'
import MemberCard from './MemberCard';
import { fetchCurrentUserLikeIds } from '../(auth)/actions/likeActions';

export default async function MembersPage() {
    const members = await getMembers();
    const likeIds = await fetchCurrentUserLikeIds()
    
    return (
        <div className='mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8'>
            {members && members.map(member => (
                <MemberCard member={member} key={member.id} likeIds={likeIds}/>
            ))}
        </div>
    )
}


