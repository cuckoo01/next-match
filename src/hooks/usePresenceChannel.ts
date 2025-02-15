import { useCallback, useEffect, useRef } from "react"
import usePresenceStore from "./usePresenceStore"
import { pushClient } from "@/lib/pusher";
import { Channel, Members } from "pusher-js";
import { updateLastActive } from "@/app/(auth)/actions/memberActions";

export const usePresenceChannel = () => {
    const {set, add, remove} = usePresenceStore(state => ({ // initial state?
        set: state.set, 
        add: state.add,
        remove: state.remove
    }));

    const channelRef = useRef<Channel | null>(null)

    const handleSetMembers = useCallback((memberIds: string[]) => {
        set(memberIds);
    }, [set])

    const handleAddMember = useCallback((memberId: string) => {
        add(memberId);
    }, [add])

    const handleRemoveMember = useCallback((memberId: string) => {
        remove(memberId);
    }, [remove])

    useEffect(() => {
        if (!channelRef.current) {
            channelRef.current = pushClient.subscribe('presence-nm');
            
            // Once a subscription has been made to a presence channel, an event is triggered with a members iterator
            channelRef.current.bind('pusher:subscription_succeeded', async (members: Members) => {
                handleSetMembers(Object.keys(members.members))  
                await updateLastActive()
            })

            // The pusher:member_added event is triggered when a user joins a channel.
            channelRef.current.bind('pusher:member_added', (member: Record<string, any>) => {
                handleAddMember(member.id)  // when a new member joins, call handleAddMember to globally store new member
            })

            // The pusher:member_removed is triggered when a user leaves a channel.
            channelRef.current.bind('pusher:member_removed', (member: Record<string, any>) => {
                handleRemoveMember(member.id)
            })

            return () => {
                if (channelRef.current && channelRef.current.subscribed) {
                    channelRef.current.unsubscribe();
                    channelRef.current.unbind('pusher:subscription_succeeded', handleSetMembers)
                    channelRef.current.unbind('pusher:member_added', handleAddMember)
                    channelRef.current.unbind('pusher:member_removed', handleRemoveMember)
                }
            }
        }
    }, [handleAddMember, handleRemoveMember, handleSetMembers])
}