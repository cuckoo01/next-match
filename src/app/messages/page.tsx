import React from 'react'
import MessageSideBar from './MessageSideBar'
import { getMessagesByContainer } from '../(auth)/actions/messageActions'
import MessageTable from './MessageTable';

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ container: string }> }) {
    const searchParamsObj = await searchParams;
    const messages = await getMessagesByContainer(searchParamsObj.container)
    console.log({ messages });

    return (
        <div className='grid grid-cols-12 gap-5 h-[80vh] mt-10'>
            <div className='col-span-2'>
                <MessageSideBar />
            </div>

            <div className='col-span-10'>
                <MessageTable messages={messages} />
            </div>

        </div>
    )
}
