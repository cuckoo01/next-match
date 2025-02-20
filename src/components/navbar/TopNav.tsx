
import { Button, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GiMatchTip } from 'react-icons/gi'
import NavLink from './NavLink'
import UserMenu from './UserMenu'
import { useSession } from 'next-auth/react'
import { getUserInfoForNav } from '@/app/(auth)/actions/userActions'
import FilterWrapper from './FilterWrapper'

export default function TopNav() {
    const { data: session } = useSession()
    const [userInfo, setUserInfo] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserInfo = async () => {
            const result = await getUserInfoForNav();
            setUserInfo(result)
        }
        if (session?.user) {
            fetchUserInfo()
        }
        setLoading(false)
    }, [session])


    return (
        <>
            <Navbar
                maxWidth='xl'
                className='bg-gradient-to-t from-purple-400 to-purple-700'
                classNames={{
                    item: [
                        'text-xl',
                        'text-white',
                        'uppercase',
                        'data-[active=true]:text-yellow-200'
                    ]
                }}
            >
                <NavbarBrand as={Link} href='/'>
                    <GiMatchTip size={40} className='text-gray-200' />
                    <div className='font-bold text-3xl flex'>
                        <span className='text-gray-900'>Next</span>
                        <span className='text-gray-200'>Match</span>
                    </div>
                </NavbarBrand>
                <NavbarContent justify='center'>
                    <NavLink href='/members' label='Matches' />
                    <NavLink href='/lists' label='Lists' />
                    <NavLink href='/messages' label='Messages' />
                </NavbarContent>
                <NavbarContent justify='end'>
                    {!isLoading && userInfo ? (
                        <UserMenu userInfo={userInfo} />
                    ) : (
                        <>
                            <Button as={Link} href='/login' variant='bordered' className='text-white'>Login</Button>
                            <Button as={Link} href='/register' variant='bordered' className='text-white'>Register</Button>
                        </>
                    )}
                </NavbarContent>
            </Navbar>

            <FilterWrapper />
        </>

    )
}
