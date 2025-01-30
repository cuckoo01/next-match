'use client'

import React, { useState } from 'react'
import { deleteImage, setMainImage } from '@/app/(auth)/actions/userActions';
import DeleteButton from '@/components/DeleteButton';
import MemberImage from '@/components/MemberImage';
import StarButton from '@/components/StarButton';
import { Photo } from '@prisma/client'


type Props = {
    userPhotos: Photo[] | null;
    editing?: boolean;
    mainImageUrl?: string | null;
}

export default function MemberPhotos({ userPhotos, editing, mainImageUrl }: Props) {
    const [loading, setLoading] = useState({
        type: '',
        isLoading: false,
        id: ''
    })

    const onSetMain = async (photo: Photo) => {
        if (photo.url === mainImageUrl) return null;
        setLoading({ isLoading: true, id: photo.id, type: 'main' });
        await setMainImage(photo);
        setLoading({ isLoading: false, id: '', type: '' });
        window.location.reload() //router.refresh() only works in server-side
    }

    const onDelete = async (photo: Photo) => {
        if (photo.url === mainImageUrl) return null;
        setLoading({ isLoading: true, id: photo.id, type: 'delete' });
        await deleteImage(photo);
        setLoading({ isLoading: false, id: '', type: '' });
        window.location.reload() //router.refresh() only works in server-side
    }

    return (
        <div className='grid grid-cols-5 gap-3 p-5'>
            {userPhotos && userPhotos.map(photo => (
                <div key={photo.id} className='relative'>
                    <MemberImage photo={photo} />
                    {editing && (
                        <>
                            <div onClick={() => onSetMain(photo)} className='absolute top-3 left-3 z-50'>
                                <StarButton
                                    selected={photo.url === mainImageUrl}
                                    loading={
                                        loading.isLoading
                                        && loading.type === 'main'
                                        && loading.id === photo.id
                                    }
                                />
                            </div>
                            <div onClick={() => onDelete(photo)} className='absolute top-3 right-3 z-50'>
                                <DeleteButton
                                    loading={
                                        loading.isLoading
                                        && loading.type === 'delete'
                                        && loading.id === photo.id
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}
