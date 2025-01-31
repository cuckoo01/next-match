import { Message } from "@prisma/client";
import { formatShortDateTime } from "./util";
import { MessageWithSenderRepicient } from "@/types";

export function mapMessageToMessageDto(message: MessageWithSenderRepicient) {
    return {
        id: message.id,
        text: message.text,
        created: formatShortDateTime(message.created),
        dataRead: message.dataRead ? formatShortDateTime(message.dataRead) : null,
        senderId: message.sender?.userId,
        senderName: message.sender?.name,
        senderImage: message.sender?.image,
        recipientId: message.recipient?.userId,
        recipientName: message.recipient?.name,
        recipientImage: message.recipient?.image,
    }
}