import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react'
import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { signOutUser } from '@/app/(auth)/actions/authActions'

type Props = {
    user: Session['user']
}

export default function UserMenu({user}: Props) {
  return (
    <Dropdown placement='bottom-start'>
        <DropdownTrigger>
            <Avatar 
                isBordered
                as='button'
                className='transition transform'
                color='secondary'
                name={user?.name || 'user avatar'}
                size='sm'
                src={user?.image || 'images/user.png'}
            />
        </DropdownTrigger>
        <DropdownMenu variant='flat' aria-label='User actions menu'>
            <DropdownSection showDivider>
                <DropdownItem isReadOnly as='span' className='h-14 flex flex-row' aria-label='username'>
                    Sign in as {user?.name}
                </DropdownItem>
            </DropdownSection>
                <DropdownItem as={Link} href='/members/edit'>
                    Edit profile
                </DropdownItem>
                <DropdownItem color='danger' onClick={async () => signOutUser()}>
                    Log out
                </DropdownItem>
        </DropdownMenu>
    </Dropdown>
  )
}
