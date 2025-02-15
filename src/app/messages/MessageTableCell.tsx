import { MessageDto } from '@/types'
import React from 'react'
import { deleteMessage } from '../(auth)/actions/messageActions';
import PresenceAvatar from '@/components/PresenceAvatar';
import { truncateString } from '@/lib/util';
import { Button } from '@nextui-org/react';
import { AiFillDelete } from 'react-icons/ai';

type Props = {
    item: MessageDto;
    columnKey: string;
    isOutbox: boolean;
    deleteMessage: (message: MessageDto) => void;
    isDeleting: boolean;
}

export default function MessageTableCell({ item, columnKey, isOutbox, deleteMessage, isDeleting }: Props) {
    const cellValue = item[columnKey as keyof MessageDto]

    switch (columnKey) {
        case 'recipientName': // same as case "senderName"
        case 'senderName':
            return (
                <div className={`flex items-center gap-2 cursor-pointer ${!item.dataRead && !isOutbox ? 'font-semibold' : ''}`}>
                    <PresenceAvatar
                        userId={isOutbox ? item.recipientId : item.senderId}
                        src={isOutbox ? item.recipientImage : item.senderImage}
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
                    onPress={() => deleteMessage(item)}
                    isLoading={isDeleting}
                >
                    <AiFillDelete size={24} className='text-danger' />
                </Button >
            )
    }
}