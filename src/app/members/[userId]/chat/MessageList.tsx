'use client'

import { MessageDto } from '@/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import { pushClient } from '@/lib/pusher';
import { formatShortDateTime } from '@/lib/util';
import { Channel } from 'pusher-js';
import useMessageStore from '@/hooks/useMessageStore';

type Props = {
    initialMessages: { messages: MessageDto[], readCount: number };
    currentUserId: string;
    chatId: string;
}

export default function MessageList({ initialMessages, currentUserId, chatId }: Props) {
    const setReadCount = useRef(false);
    const [messages, setMessages] = useState(initialMessages.messages)
    const { updateUnreadCount } = useMessageStore(state => ({
        updateUnreadCount: state.updateUnreadCount
    }))

    // make sure to render once
    useEffect(() => {
        if (!setReadCount.current) {
            updateUnreadCount(-initialMessages.readCount);
            setReadCount.current = true;
        }
    }, [initialMessages.readCount, updateUnreadCount])

    const channelRef = useRef<Channel | null>(null)

    const handleNewMessage = useCallback((message: MessageDto) => {
        setMessages(prevState => {
            return [...prevState, message]
        })
    }, [])

    // initial messages include both sides of the conversation 
    const handleReadMessages = useCallback((messageIds: string[]) => {
        setMessages(prevState => prevState.map(message => messageIds.includes(message.id)
            ? { ...message, dataRead: formatShortDateTime(new Date()) } // filter out read messages from the sender
            : message // recipient's messages
        ))
    }, [])

    useEffect(() => {
        if (!channelRef.current) {
            // subscribe to a previously-created channel from the server-side
            channelRef.current = pushClient.subscribe(chatId);

            // listen for events on the channel
            channelRef.current.bind('message:new', handleNewMessage)
            channelRef.current.bind('message:read', handleReadMessages)
        }

        // unscribe and unbind when a component unmounts
        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new', handleNewMessage)
                channelRef.current.unbind('message:read', handleReadMessages)
            }
        }
    }, [chatId, handleNewMessage, handleReadMessages])


    return (
        <div>
            {messages.length === 0 ? 'No messages to display' : (
                <div>
                    {messages.map(message => (
                        <MessageBox
                            key={message.id}
                            message={message}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
