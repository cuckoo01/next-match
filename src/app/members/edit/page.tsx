
'use client'
import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import React, { useState, useEffect } from 'react'
import EditForm from './EditForm'
import { getAuthUserId } from '@/app/(auth)/actions/authActions'
import { getMemberByUserId } from '@/app/(auth)/actions/memberActions';
import { notFound } from 'next/navigation';
import LoadingComponent from '@/components/LoadingComponent';

type Member = {
    userId: string;
    image: string | null;
    id: string;
    name: string;
    gender: string;
    dateOfBirth: Date;
    created: Date;
    updated: Date;
    description: string;
    city: string;
    country: string;
} | null | undefined

export default function MemberEditPage() {

    // const userId = await getAuthUserId();

    // const member = await getMemberByUserId(userId);

    // if (!member) return notFound();   

    const [userId, setUserId] = useState<string | null>(null)
    const [member, setMember] = useState<Member>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserId = async () => {
            const result = await getAuthUserId();
            setUserId(result)
        }
        const fetchMember = async () => {
            const result = await getMemberByUserId(userId as string);
            setMember(result)
            setLoading(false)
        }
        fetchUserId()
        if (userId) {
            fetchMember()
        }
    }, [userId])

    if (isLoading) return <LoadingComponent />

    if (!isLoading && !member) return notFound()

    return (
        <>
            <CardHeader className='text-2xl font-semibold text-secondary'>
                Edit Profile
            </CardHeader>
            <Divider />
            <CardBody>
                <EditForm member={member} />
            </CardBody>
        </>
    )
}
