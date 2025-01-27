'use server'

import { getMemberByUserId } from "@/app/(auth)/actions/memberActions";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import CardForLayout from "../CardForLayout";

export default async function Layout({children, params}: 
    { children: ReactNode, params: {userId: string}}) {
    
    const member = await getMemberByUserId(params.userId);
    if (!member) return notFound();

    return (
        <div className="grid grid-cols-12 gap-5 h-[80vh]">
            <div className="col-span-3">
                <MemberSidebar member={member}/>
            </div>
            <div className="col-span-9">
                <CardForLayout>{children}</CardForLayout>
            </div>
        </div>
    )
    
}