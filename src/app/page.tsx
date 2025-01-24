'use client'

import { Button } from "@nextui-org/react";
import { FaRegSmile } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession()  // renaming 'data' to 'session'

    return (
        <div>
            <h1 className="text-3xl text-red-500 font-semibold">Hello App!</h1>

            <h3 className="text-2xl font-semibold">User session data: </h3>
            {session ? (
                <div>
                    <pre>{JSON.stringify(session, null, 2)}</pre>
                    <form action={async () => {
                        await signOut()
                    }}>
                        <Button 
                            type='submit'
                            color='primary' 
                            variant='bordered' 
                            startContent={<FaRegSmile size={20}/>}
                        >
                        Sign Out
                        </Button>
                    </form>
                </div>
            ) : (
                <div>Not signed in</div>
            )}
        </div>
    )
}
