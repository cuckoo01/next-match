'use client'

import { NextUIProvider } from '@nextui-org/react'
import React, { ReactNode } from 'react'
import TopNav from './navbar/TopNav'
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';


export default function Providers({children} : {children: ReactNode}) {
  return (
    <NextUIProvider>
        <SessionProvider>
            <TopNav />
            <ToastContainer position='bottom-right' hideProgressBar className='z-50'/>
            <main className='container mx-auto p-10'>
                {children}
            </main>
        </SessionProvider>
    </NextUIProvider>
  )
}
