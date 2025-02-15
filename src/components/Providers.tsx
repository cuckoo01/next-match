'use client'

import { NextUIProvider } from '@nextui-org/react'
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import TopNav from './navbar/TopNav'
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
import { usePresenceChannel } from '@/hooks/usePresenceChannel';
import { useNotificationChannel } from '@/hooks/useNotificationChannel';
import useMessageStore from '@/hooks/useMessageStore';
import { getUnreadMessageCount } from '@/app/(auth)/actions/messageActions';


export default function Providers({ children, userId }: { children: ReactNode, userId: string | null }) {
    const isUnreadCountSet = useRef(false);

    const { updateUnreadCount } = useMessageStore(state => ({
        updateUnreadCount: state.updateUnreadCount
    }))

    const setUnreadCount = useCallback((amount: number) => {
        updateUnreadCount(amount);
    }, [updateUnreadCount])

    useEffect(() => {
        // to avoid refetching unread messages twice
        if (userId && !isUnreadCountSet.current) {
            getUnreadMessageCount().then(count => {
                setUnreadCount(count)
            })
            isUnreadCountSet.current = true;
        }
    }, [setUnreadCount, userId])

    usePresenceChannel();
    useNotificationChannel(userId);
    return (
        <NextUIProvider>
            <SessionProvider>
                <TopNav />
                <ToastContainer position='bottom-right' hideProgressBar className='z-50' />
                <main className='container mx-auto p-10'>
                    {children}
                </main>
            </SessionProvider>
        </NextUIProvider>
    )
}
