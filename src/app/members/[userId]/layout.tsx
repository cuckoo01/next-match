'use server'

import { getMemberByUserId } from "@/app/(auth)/actions/memberActions";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import CardForLayout from "../CardForLayout";

export default async function Layout({ children, params }:
    { children: ReactNode, params: Promise<{ userId: string }> }) {
    const paramsObj = await params;
    const member = await getMemberByUserId(paramsObj.userId);
    if (!member) return notFound();

    const basePath = `/members/${member.userId}`

    const navLinks = [
        { name: 'Profile', href: `${basePath}` },
        { name: 'Photos', href: `${basePath}/photos` },
        { name: 'Chat', href: `${basePath}/chat` }
    ]

    return (
        <div className="grid grid-cols-12 gap-5 h-[80vh]">
            <div className="col-span-3">
                <MemberSidebar member={member} navLinks={navLinks} />
            </div>
            <div className="col-span-9">
                <CardForLayout>{children}</CardForLayout>
            </div>
        </div>
    )

}