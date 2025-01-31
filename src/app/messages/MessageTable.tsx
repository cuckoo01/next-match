'use client'

import { MessageDto } from '@/types';
import { Avatar, Button, Card, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import React, { Key, useCallback, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai';
import { deleteMessage } from '../(auth)/actions/messageActions';
import { truncateString } from '@/lib/util';

type Props = {
    messages: MessageDto[];
}

export default function MessageTable({ messages }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter()
    const isOutbox = searchParams.get('container') === 'outbox';
    const [isDeleting, setDeleting] = useState({ id: '', loading: false })

    // define columns for TableHeader (using Label) & TableRow (using Key)
    const columns = [
        { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender' },
        { key: 'text', label: 'Message' },
        { key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
        { key: 'actions', label: 'Actions' },
    ]

    const handleRowSelect = (key: Key) => {
        const message = messages.find(m => m.id === key);
        const url = isOutbox ? `members/${message?.recipientId}` : `members/${message?.senderId}`
        router.push(url + '/chat')
    }

    const handleDeleteMessage = useCallback(async (message: MessageDto) => {
        setDeleting({ id: message.id, loading: true });
        await deleteMessage(message.id, isOutbox);
        window.location.reload();
        setDeleting({ id: '', loading: false });
    }, [isOutbox])

    // avoid unnecessary rerenderings 
    // only rerenders when changing between "Inbox" & "Outbox"
    const renderCell = useCallback((item: MessageDto, columnKey: keyof MessageDto) => {
        const cellValue = item[columnKey]

        switch (columnKey) {
            case 'recipientName': // same as case "senderName"
            case 'senderName':
                return (
                    <div className={`flex items-center gap-2 cursor-pointer ${!item.dataRead && !isOutbox ? 'font-semibold' : ''}`}>
                        <Avatar
                            alt="Image of member"
                            src={(isOutbox ? item.recipientImage : item.senderImage) || '/images/user.png'}
                        />
                        <span>{cellValue}</span>
                    </div>
                )
            case 'text':
                return (
                    <div>
                        {truncateString(cellValue, 80)}
                    </div>
                )
            case 'created':
                return cellValue
            default:
                return (
                    <Button isIconOnly variant='light'
                        onPress={() => handleDeleteMessage(item)}
                        isLoading={isDeleting.id === item.id && isDeleting.loading}
                    >
                        <AiFillDelete size={24} className='text-danger' />
                    </Button >
                )
        }
    }, [isOutbox, isDeleting.id, isDeleting.loading, handleDeleteMessage])

    return (
        <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
            <Table
                aria-label='Table with messages'
                selectionMode='single'
                onRowAction={(key) => handleRowSelect(key)} // this key is equal of "item.id"
                shadow='none'
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}
                        width={column.key === 'text' ? '50%' : undefined}
                    >
                        {column.label}
                    </TableColumn>}
                </TableHeader>

                <TableBody items={messages} emptyContent='No messages for this container'>
                    {(item) => (
                        <TableRow key={item.id} className='cursor-pointer'>
                            {(columnKey) => (   // for example, if key is "text" => getKeyValue of "text"
                                <TableCell>
                                    <div className={!isOutbox && !item.dataRead ? 'font-semibold' : ''}>
                                        {renderCell(item, columnKey as keyof MessageDto)}
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>

            </Table>
        </Card>

    )
}
