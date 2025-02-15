import { usePathname, useSearchParams } from 'next/navigation';
import { pushClient } from "@/lib/pusher";
import { Channel } from "pusher-js"
import { useCallback, useEffect, useRef } from "react"
import useMessageStore from './useMessageStore';
import { MessageDto } from '@/types';
import { newLikeToast, newMessageToast } from '@/components/NotificationToast';

export const useNotificationChannel = (userId: string | null) => {
    const channelRef = useRef<Channel | null>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const {add, updateUnreadCount} = useMessageStore(state => ({
        add: state.add,
        updateUnreadCount: state.updateUnreadCount
    }))

    const handleNewMessage = useCallback((message: MessageDto) => {
        if (pathname === '/messages' && searchParams.get('container') !== 'outbox') { // Inbox
            add(message);   // add a new message to a global store => it can be retrived anywhere using useMessages hook 
            updateUnreadCount(1)
        } else if (pathname !== `/members/${message.senderId}/chat`) { // not in the chatbox
            newMessageToast(message)
            updateUnreadCount(1)
        }
    }, [add, pathname, searchParams, updateUnreadCount])

    const handleNewLike = useCallback((data: {name: string, image: string | null, userId: string}) => {
        newLikeToast(data.name, data.image, data.userId);
    }, []) 

    useEffect(() => {
        console.log('abc')
        if (!userId) return;  // user must be authenticated (signed in) before going on

        if (!channelRef.current) {
            console.log('useNotificationChannel')
            channelRef.current = pushClient.subscribe(`private-${userId}`)
            channelRef.current.bind('message:new', handleNewMessage)
            channelRef.current.bind('message:like', handleNewLike)
        }

        return () => {
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new', handleNewMessage);
                channelRef.current.unbind('message:like', handleNewLike)
                channelRef.current = null; 
            }
        }
    }, [userId, handleNewMessage, handleNewLike])
}