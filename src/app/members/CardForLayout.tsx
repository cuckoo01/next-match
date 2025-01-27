'use client'

import React from 'react'
import { ReactNode } from "react";
import { Card } from "@nextui-org/react";

export default function CardForLayout({children}: {children: ReactNode}) {
  return (
    <Card className="w-full mt-10 h-[80vh]">
        {children}
    </Card>
  )
}
