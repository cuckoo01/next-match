
import { getMemberByUserId } from '@/app/(auth)/actions/memberActions'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function MemberDetailedPage({params}: {params: {userId: string}}) { // Here, params is expected to be an object with a userId of type string.
    const member = await getMemberByUserId(params.userId)

    if (!member) return notFound()

    return (
        <div>{member.name}</div>
    )
}

