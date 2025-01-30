'use client'

import React from 'react'
import { CardHeader, Divider, CardBody } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { getAuthUserId } from '@/app/(auth)/actions/authActions'
import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/(auth)/actions/memberActions'
import LoadingComponent from '@/components/LoadingComponent'
import Image from 'next/image'
import StarButton from '@/components/StarButton'
import DeleteButton from '@/components/DeleteButton'
import ImageUploadButton from '@/components/ImageUploadButton'
import MemberPhotoUpload from './MemberPhotoUpload'
import MemberImage from '@/components/MemberImage'
import MemberPhotos from './MemberPhotos'


export default function PhotosPage() {
    const [userId, setUserId] = useState<string | null>(null)
    const [userPhotos, setUserPhotos] = useState(null)
    const [member, setMember] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserId = async () => {
            const result = await getAuthUserId();
            setUserId(result)
        }
        const fetchMember = async () => {
            const result = await getMemberByUserId(userId);
            setMember(result)
        }
        const fetchUserPhoto = async () => {
            const result = await getMemberPhotosByUserId(userId as string);
            setUserPhotos(result)
            setLoading(false)
        }
        fetchUserId()
        if (userId) {
            fetchMember()
            fetchUserPhoto()
        }
    }, [userId])

    if (isLoading) return <LoadingComponent />

    return (
        <>
            <CardHeader className='flex flex-row justify-between items-center'>
                <div className='text-2xl font-semibold text-secondary'>
                    Edit Profile
                </div>
                <MemberPhotoUpload />   {/* Button to upload image */}
            </CardHeader>
            <Divider />
            <CardBody>
                <MemberPhotos userPhotos={userPhotos} editing={true} mainImageUrl={member?.image} />
            </CardBody>
        </>
    )
}
