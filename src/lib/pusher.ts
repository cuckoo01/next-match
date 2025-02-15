import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

declare global {
    var pusherServerInstance: PusherServer | undefined;
    var pusherClientInstance: PusherClient | undefined;
}

if (!global.pusherServerInstance) {
    global.pusherServerInstance = new PusherServer({
        appId: process.env.PUSHER_APP_ID!,  // ! is a TypeScript non-null assertion operator. It tells the TypeScript compiler that you are certain the value of process.env.PUSHER_APP_ID will not be null or undefined at runtime.
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
        secret: process.env.PUSHER_SECRET!,
        cluster: 'ap1',
        useTLS: true // encrypt the data being transmitted 
    })
}


if (!global.pusherClientInstance) {
    global.pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        channelAuthorization: {
            endpoint: '/api/auth/pusher-auth',
            transport: 'ajax'
        },
        cluster: 'ap1'
    })
}

export const pushServer = global.pusherServerInstance;
export const pushClient = global.pusherClientInstance;