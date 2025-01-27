'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Photo } from "@prisma/client"

export async function getMembers() {
    const session = await auth()
    if (!session) return null

    try {
        // throw new Error('Just testing...') // testing error.tsx
        
        return prisma.member.findMany({
            where: {
                NOT: {
                    userId: session?.user?.id
                }
            }
        })
    } catch (error) {
        // throw new Error('Just testing...')
        console.log(error)
    }
}

export async function getMemberByUserId(userId: string) {
    try {
        return prisma.member.findUnique({where: {userId}})
    } catch (error) {
        console.log(error)
    }
}

export async function getMemberPhotosByUserId(userId: string) {
    const member = await prisma.member.findUnique({
        where: {userId},
        // include: {photos: true}
        select: {photos: true}
    });

    if (!member) return null;

    return member.photos.map(p => p) as Photo[]
}