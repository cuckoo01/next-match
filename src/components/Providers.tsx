'use client'

import { NextUIProvider } from '@nextui-org/react'
import React, { ReactNode } from 'react'
import TopNav from './navbar/TopNav'

export default function Providers({children} : {children: ReactNode}) {
  return (
    <NextUIProvider>
        <TopNav />
        <main className='container mx-auto p-10'>
            {children}
        </main>
    </NextUIProvider>
  )
}
