

import CardInnerWrapper from '@/components/CardInnerWrapper'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/app/(auth)/actions/messageActions'
import MessageBox from './MessageBox';
import { getAuthUserId } from '@/app/(auth)/actions/authActions';
import MessageList from './MessageList';
import { createChatId } from '@/lib/util';

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
    const paramsObj = await params;
    const userId = await getAuthUserId();
    const messages = await getMessageThread(paramsObj.userId);
    const chatId = createChatId(userId, paramsObj.userId)

    return (
        <>
            <CardInnerWrapper
                header='Chat'
                body={<MessageList initialMessages={messages} currentUserId={userId} chatId={chatId} />}
                footer={<ChatForm />}
            />
        </>
    )
}
