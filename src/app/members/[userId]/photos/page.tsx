'use client'

import { getMemberPhotosByUserId } from '@/app/(auth)/actions/memberActions'
import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react'
import { useParams } from 'next/navigation'
import React from 'react'
import { useState, useEffect } from 'react'

type resultType = { 
    id: string;
    url: string;
    publicId: string | null;
    memberId: string;
}[] | null

export default function PhotosPage() {
    const params = useParams()

    const [photos, setPhotos] = useState<resultType>(null)
    const [isLoading, setLoading] = useState(true)
 
    useEffect(() => {
        const fetchPhotos = async () => {
            const result = await getMemberPhotosByUserId(params.userId);
            setPhotos(result)
            setLoading(false)
        }          
        fetchPhotos()
    }, [params.userId])

    return (
        !isLoading && (
        <>
            <CardHeader className='text-2xl font-semibold text-secondary'>
                Photos  
            </CardHeader>
            <Divider />
            <CardBody>
                <div className='grid grid-cols-5 gap-3'>
                    {photos && photos.map(photo => (
                        <div key={photo.id}>
                            <Image 
                                width={300}
                                height={300}
                                src={photo.url}
                                alt="Image of member"
                                className='object-cover aspect-square'
                            />
                        </div>
                    ))}
                </div>
            </CardBody>
        </>
        )    
    )
}
