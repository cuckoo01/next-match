'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import Filters from './Filters'

// Use wrapper to hide the url of Filters
export default function FilterWrapper() {
    const pathname = usePathname()

    if (pathname === '/members') return <Filters />
    else return null
}
